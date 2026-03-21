"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

// ================= FETCH USER =================
export async function fetchUser(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });

    if (!user) return null;

    // ✅ CRITICAL FIX: return plain object
    return {
      id: user.id,
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      bio: user.bio,
      image: user.image,
      onboarded: user.onboarded,

      communities: user.communities?.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        image: c.image,
      })) || [],

      threads: user.threads?.map((t: any) => t.toString()) || [],
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// ================= UPDATE USER =================
interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    await connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

// ================= FETCH USER POSTS =================
export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
          },
        },
      ],
    });

    if (!user) return null;

    // ✅ CLEAN RESPONSE
    return {
      threads: user.threads.map((thread: any) => ({
        _id: thread._id.toString(),
        text: thread.text,
        createdAt: thread.createdAt.toString(),

        author: {
          id: thread.author?.toString(),
        },

        community: thread.community
          ? {
              id: thread.community._id.toString(),
              name: thread.community.name,
              image: thread.community.image,
            }
          : null,
      })),
    };
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// ================= FETCH USERS =================
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const usersQuery = User.find(query)
      .sort({ createdAt: sortBy })
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    // ✅ CLEAN USERS
    const cleanUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      image: u.image,
    }));

    return { users: cleanUsers, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// ================= ACTIVITY =================
export async function getActivity(userId: string) {
  try {
    await connectToDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc: any[], thread) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
    });

    // ✅ CLEAN RESPONSE
    return replies.map((r: any) => ({
      _id: r._id.toString(),
      parentId: r.parentId?.toString(),
      author: {
        name: r.author.name,
        image: r.author.image,
      },
    }));
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}