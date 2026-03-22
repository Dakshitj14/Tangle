"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";

// ================= LIKE =================
export async function toggleLike(threadId: string, userId: string) {
  await connectToDB();

  const thread = await Thread.findById(threadId);
  if (!thread) return;

  const isLiked = thread.likes.includes(userId);

  if (isLiked) {
    thread.likes = thread.likes.filter((id: string) => id !== userId);
  } else {
    thread.likes.push(userId);
  }

  await thread.save();
}

// ================= FETCH POSTS =================
export async function fetchPosts(
  pageNumber = 1,
  pageSize = 20,
  communityId?: string
) {
  await connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const query: any = {
    parentId: { $in: [null, undefined] },
  };

  // ✅ IMPORTANT FIX
  if (communityId) {
    query.community = communityId;
  }

  const postsQuery = Thread.find(query)
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name image",
      },
    });

  const posts = await postsQuery.exec();

  const totalPostsCount = await Thread.countDocuments(query);

  const isNext = totalPostsCount > skipAmount + posts.length;

  const formattedPosts = posts.map((post: any) => ({
    _id: post._id.toString(),
    text: post.text,
    parentId: post.parentId?.toString() || null,
    createdAt: post.createdAt.toString(),
    likes: post.likes || [],

    author: {
      id: post.author._id.toString(),
      name: post.author.name,
      image: post.author.image,
    },

    community: post.community
      ? {
          id: post.community._id.toString(),
          name: post.community.name,
          image: post.community.image,
        }
      : null,

    children: post.children.map((child: any) => ({
      author: {
        image: child.author.image,
      },
    })),
  }));

  return {
    posts: formattedPosts,
    isNext,
  };
}

// ================= CREATE THREAD =================
interface Params {
  text: string;
  author: string;
  communityId: string | null;
  communityName?: string | null;
  communityImage?: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  communityName,
  communityImage,
  path,
}: Params) {
  try {
    await connectToDB();

    let communityDoc = null;

    if (communityId) {
      // 🔍 Try finding existing community
      communityDoc = await Community.findOne({ id: communityId });

      // ✅ CREATE if not exists (THIS IS WHERE YOUR CODE GOES)
      if (!communityDoc) {
        communityDoc = await Community.create({
          id: communityId,
          name: communityName || "Organization",
          username: communityName ? communityName.replace(/\s+/g, "").toLowerCase(): `org_${communityId}`,
          image: communityImage || "/assets/community.svg",
        });

        console.log("✅ Community CREATED:", communityDoc);
      }
    }

    const createdThread = await Thread.create({
      text,
      author,
      community: communityDoc?._id || null,
    });

    await User.findOneAndUpdate(
      { id: author },
      { $push: { threads: createdThread._id } }
    );

    if (communityDoc) {
      await Community.findByIdAndUpdate(communityDoc._id, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

// ================= DELETE THREAD =================
async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    await connectToDB();

    const mainThread = await Thread.findById(id).populate(
      "author community"
    );

    if (!mainThread) throw new Error("Thread not found");

    const descendantThreads = await fetchAllChildThreads(id);

    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) =>
          thread.author?._id?.toString()
        ),
        mainThread.author?._id?.toString(),
      ].filter(Boolean)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) =>
          thread.community?._id?.toString()
        ),
        mainThread.community?._id?.toString(),
      ].filter(Boolean)
    );

    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

// ================= FETCH THREAD BY ID =================
// ================= FETCH THREAD BY ID =================
export async function fetchThreadById(threadId: string) {
  await connectToDB();

  const thread = await Thread.findById(threadId)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
      },
    });

  if (!thread) throw new Error("Thread not found");

  return {
    _id: thread._id.toString(),
    text: thread.text,
    parentId: thread.parentId?.toString() || null,
    createdAt: thread.createdAt.toString(),
    likes: thread.likes || [], // ✅ FIXED

    author: {
      id: thread.author._id.toString(),
      name: thread.author.name,
      image: thread.author.image,
    },

    community: thread.community
      ? {
          id: thread.community._id.toString(),
          name: thread.community.name,
          image: thread.community.image,
          createdBy: thread.community.createdBy?.toString(),
        }
      : null,

    children: thread.children.map((child: any) => ({
      _id: child._id.toString(),
      text: child.text,
      parentId: child.parentId?.toString() || null,
      createdAt: child.createdAt?.toString(),

      likes: child.likes || [], // ✅ FIXED (IMPORTANT)

      author: {
        id: child.author._id.toString(),
        name: child.author.name,
        image: child.author.image,
      },
    })),
  };
}

// ================= ADD COMMENT =================
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  await connectToDB();

  const originalThread = await Thread.findById(threadId);
  if (!originalThread) throw new Error("Thread not found");

  const commentThread = new Thread({
    text: commentText,
    author: userId,
    parentId: threadId,
  });

  const savedCommentThread = await commentThread.save();

  originalThread.children.push(savedCommentThread._id);
  await originalThread.save();

  revalidatePath(path);
}