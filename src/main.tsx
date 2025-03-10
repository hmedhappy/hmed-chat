import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Sign from './Sign';


const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <SignedOut  >
          <Sign />
        </SignedOut>
        <SignedIn>
          <App />
        </SignedIn>
      </ClerkProvider>
    </ConvexProvider>
  </StrictMode>,
);
