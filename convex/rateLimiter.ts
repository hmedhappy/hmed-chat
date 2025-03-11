import { HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Global rate limit: max 100 sign-ups per hour
  freeTrialSignUp: { kind: "fixed window", rate: 100, period: HOUR },
  // Per-user rate limit: max 10 messages per minute, with a burst capacity of 3
  sendMessage: { kind: "token bucket", rate: 100, period: MINUTE, capacity: 5 },
});
