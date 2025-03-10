import { UserButton, useUser } from "@clerk/clerk-react";
import { faker } from "@faker-js/faker";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from 'sweetalert';
import { api } from "../convex/_generated/api";


// Define the shape of a message
interface Message {
  _id: string;
  user: string;
  body: string;
}

// For demo purposes. In a real app, you'd have real user data.

export default function App() {
  const { user } = useUser();
  const NAME = useMemo(() => getOrSetFakeName(user), [user])

  const messages = useQuery(api.chat.getMessages) as Message[] | undefined; // Fetch messages
  const sendMessage = useMutation(api.chat.sendMessage); // Mutation to send a message
  const deleteMessage = useMutation(api.chat.deleteMessage); // Mutation to delete a message

  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  // Handle swipe gestures
  const handleSwipe = (messageId: string) => {
    Swal({
      title: 'Are you sure?',
      text: 'Do you want to delete this message?',
      icon: 'warning',
      buttons: ['Cancel', 'Yes'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Perform delete action
        Swal('Message deleted!', {
          icon: 'success',
        });
        deleteMessage({ id: messageId as any }); // Delete the message
        console.log('Message deleted!');
      } else {
        // Cancel action
        Swal('Deletion canceled.');
        console.log('Deletion canceled.');
      }
    });
  };

  return (
    <main className="chat">
      <header>
        <UserButton />
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong style={{ textTransform: "capitalize" }}>{NAME}</strong>
        </p>
      </header>
      {messages?.map((message) => (
        <SwipeableMessage
          key={message._id}
          message={message}
          isMine={message.user === NAME}
          onSwipe={() => handleSwipe(message._id)}
        />
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ user: NAME, body: newMessageText });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={(e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </main>
  );
}

// Props for the SwipeableMessage component
interface SwipeableMessageProps {
  message: Message;
  isMine: boolean;
  onSwipe: () => void;
}

// SwipeableMessage component
function SwipeableMessage({ message, isMine, onSwipe }: SwipeableMessageProps) {
  const touchStartX = useRef<number | null>(null); // Track touch start position
  const [swipeOffset, setSwipeOffset] = useState(0); // Track swipe offset
  const [isSwiping, setIsSwiping] = useState(false); // Track if swiping is in progress
  const [isDeleted, setIsDeleted] = useState(false); // Track if message is deleted
  const screenWidth = window.innerWidth; // Get screen width

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX.current;
      setSwipeOffset(deltaX); // Update swipe offset
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      const swipeDistance = Math.abs(swipeOffset);
      const swipeThreshold = screenWidth * 0.5; // 50% of screen width

      if (swipeDistance > swipeThreshold) {
        // Reset the swipe offset immediately
        setSwipeOffset(0);

        // Trigger the SweetAlert confirmation dialog
        onSwipe(); // This will call the `handleSwipe` function in the parent component
      } else {
        // Reset swipe offset if swipe is not significant
        setSwipeOffset(0);
      }
    }
    setIsSwiping(false);
    touchStartX.current = null;
  };

  return (
    <article
      className={isMine ? "message-mine" : ""}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        overflow: "hidden", // Ensure the message doesn't overflow
        overflowX: "hidden"
      }}
    >
      <div>{message.user}</div>
      <p
        style={{
          transform: `translateX(${swipeOffset}px)`,
          opacity: isDeleted ? 0 : 1, // Fade out when deleted
          transition: isSwiping ? "none" : "transform 0.3s ease, opacity 0.3s ease", // Smooth transition
        }}
      >
        {message.body}
      </p>
    </article>
  );
}

// Helper function to get or set a fake name
function getOrSetFakeName(user: any): string {
  const NAME_KEY = "tutorial_name";
  const name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    const newName = user?.firstName || faker.person.firstName();
    sessionStorage.setItem(NAME_KEY, newName);
    return newName;
  }
  return name;
}