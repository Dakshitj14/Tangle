import ThreadCard from "../cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let result;

  if (accountType === "Community") {
    result = await fetchPosts(1, 20, accountId); // ✅ FILTERED
  } else {
    result = await fetchPosts(1, 20);
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.posts.map((post: any) => (
        <ThreadCard
          key={post._id}
          id={post._id}
          currentUserId={currentUserId}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
          likes={post.likes}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;