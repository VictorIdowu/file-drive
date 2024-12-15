import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { roles } from "./schema";

// Get User
export const getUser = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) throw new ConvexError("No User!");

  return user;
};

// Create User
export const createUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      image: args.image,
    });
  },
});

// Update User
export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    });
  },
});

// User to Org
export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user?.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

// Role update
export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    const org = user.orgIds.find((org) => org.orgId === args.orgId);

    if (!org) throw new ConvexError("Org not found");

    org.role = args.role;

    await ctx.db.patch(user._id, {
      orgIds: [...user?.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

// Get Profile
export const getUserProfile = query({
  args: { userId: v.id("users") },

  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
    };
  },
});

// Get personal info
export const getMe = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("Unauthorized! Login to upload file.");

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  },
});
