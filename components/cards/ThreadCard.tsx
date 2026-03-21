"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import { toggleLike } from "@/lib/actions/thread.actions";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;

  author: {
    name: string;
    image: string;
    id: string;
  };

  community: {
    id: string;
    name: string;
    image: string;
    createdBy?: string;
  } | null;

  createdAt: string;

  comments: {
    author: {
      image: string;
    };
  }[];

  likes: string[];

  isComment?: boolean;
}

function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  likes,
  isComment,
}: Props) {
  const [liked, setLiked] = useState(
    likes?.includes(currentUserId)
  );

  const handleLike = async () => {
    setLiked((prev) => !prev);
    await toggleLike(id, currentUserId);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/thread/${id}`
    );
    alert("Link copied!");
  };

  // ✅ FINAL DISPLAY FORMAT
  const displayName = community
    ? `${community.name} • ${author.name}`
    : author.name;

  const profileLink = community
    ? `/communities/${community.id}`
    : `/profile/${author.id}`;

  const profileImage = community
    ? community.image
    : author.image;

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={profileLink} className='relative h-11 w-11'>
              <Image
                src={profileImage}
                alt='profile'
                fill
                className='rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={profileLink}>
              <h4 className='text-base-semibold text-light-1'>
                {displayName}
              </h4>
            </Link>

            <p className='mt-2 text-light-2'>{content}</p>

            <div className='mt-5 flex gap-4'>
              {/* LIKE */}
              <Image
                src={
                  liked
                    ? "/assets/heart-filled.svg"
                    : "/assets/heart-gray.svg"
                }
                alt='like'
                width={24}
                height={24}
                className='cursor-pointer'
                onClick={handleLike}
              />

              {/* COMMENT */}
              <Link href={`/thread/${id}`}>
                <Image
                  src='/assets/reply.svg'
                  alt='reply'
                  width={24}
                  height={24}
                />
              </Link>

              {/* REPOST */}
              <Image
                src='/assets/repost.svg'
                alt='repost'
                width={24}
                height={24}
              />

              {/* SHARE */}
              <Image
                src='/assets/share.svg'
                alt='share'
                width={24}
                height={24}
                className='cursor-pointer'
                onClick={handleShare}
              />
            </div>
          </div>
        </div>

        <DeleteThread
          threadId={id}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className='mt-5 flex items-center'
        >
          <p className='text-gray-1'>
            {formatDateString(createdAt)} • {community.name}
          </p>
        </Link>
      )}
    </article>
  );
}

export default ThreadCard;