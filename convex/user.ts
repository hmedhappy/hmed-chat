import { query } from "./_generated/server";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get most recent messages first
    const users = await ctx.db.query("users").order("desc").take(50);
    // Reverse the list so that it's in a chronological order.
    return users.reverse();
  },
});
