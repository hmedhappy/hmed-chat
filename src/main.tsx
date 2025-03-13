import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <SignedOut  >
          <Sign />
        </SignedOut>
        <SignedIn>
          <App />
        </SignedIn>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
