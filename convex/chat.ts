import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { rateLimiter } from "./rateLimiter";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    // Get most recent messages first
    const messages = await ctx.db.query("messages").order("desc").take(50);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const sendMessage = mutation({
  args: {
    user: v.union(v.id("users"), v.string()),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Check Identity
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    console.log("This TypeScript function is running on the server.");
    const { ok, retryAfter } = await rateLimiter.limit(ctx, "sendMessage", {
      key: args.user,
    });
    if (!ok) {
      // Inform the client to retry after the specified time
      return { success: false, retryAfter };
    }
    await ctx.db.insert("messages", {
      user: args.user,
      body: args.body,
    });
  },
});

export const deleteMessage = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
