import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";
import { access } from "fs";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new ConvexError("Unauthorized! Login to upload file.");

  return await ctx.storage.generateUploadUrl();
});

const hasAccessToOrg = async (ctx: QueryCtx | MutationCtx, orgId: string) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  if (!user) return null;

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) return null;
  return { user };
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
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

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
    favorites: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) return [];

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    files = query
      ? files.filter((file) =>
          file.name.toLowerCase().includes(query.toLowerCase())
        )
      : files;

    if (args.favorites) {
      if (!hasAccess) return files;

      const favs = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
        )
        .collect();

      files = files.filter((file) =>
        favs.some((fav) => fav.fileId === file._id)
      );
    }

    return Promise.all(
      files.map(async (file) => ({
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
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access)
      throw new ConvexError(
        "Unauthorized! You don't have access to this file."
      );

    const isAdmin =
      access.user.orgIds.find((org) => org.orgId === access.file.orgId)
        ?.role === "admin";

    if (!isAdmin)
      throw new ConvexError("You do not have the access to delete files");

    await ctx.db.delete(args.fileId);
  },
});

// Toggle Favs
export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access)
      throw new ConvexError(
        "Unauthorized! You don't have access to this file."
      );

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id)
      )
      .first();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: access.file._id,
        userId: access.user._id,
        orgId: access.file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});

// Get Favs
export const getAllFavorites = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const access = await hasAccessToOrg(ctx, args.orgId);

    if (!access) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", access.user._id).eq("orgId", args.orgId)
      )
      .collect();

    return favorites;
  },
});

const hasAccessToFile = async (
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) => {
  const file = await ctx.db.get(fileId);

  if (!file) return null;

  const hasAccess = await hasAccessToOrg(ctx, file.orgId);

  if (!hasAccess) return null;

  return { user: hasAccess.user, file };
};
