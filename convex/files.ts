import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new ConvexError("Unauthorized! Login to upload file.");

  return await ctx.storage.generateUploadUrl();
});

const hasAccessToOrg = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) => {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  return hasAccess;
};

// Create File
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("Unauthorized! Login to upload file.");

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess)
      throw new ConvexError("Unauthorized! Login to upload file.");

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
    });
  },
});

// Get Files
export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return [];

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) return [];

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    const filtered = query
      ? files.filter((file) =>
          file.name.toLowerCase().includes(query.toLowerCase())
        )
      : files;

    return Promise.all(
      filtered.map(async (file) => ({
        ...file,
        ...{ fileId: (await ctx.storage.getUrl(file.fileId)) || "" },
      }))
    );
  },
});

//  Delete File
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new ConvexError("Unauthorized! Login to delete file.");

    const file = await ctx.db.get(args.fileId);

    if (!file) throw new ConvexError("This file does not exist");

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );

    if (!hasAccess)
      throw new ConvexError("Unauthorized! Login to delete file.");

    await ctx.db.delete(args.fileId);
  },
});
