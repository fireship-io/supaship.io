import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { UserContext } from "./App";
import { CreatePost } from "./CreatePost";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";
import { UpVote } from "./UpVote";

interface PostData {
  id: string;
  title: string;
  score: number;
  username: string;
  user_id: string;
}

export async function allPostsLoader({
  params: { pageNumber },
}: {
  params: { pageNumber: string };
}) {
  const { data } = await supaClient
    .rpc("get_posts", { page_number: +pageNumber })
    .select("*");
  return data;
}

export function AllPosts() {
  const { session } = useContext(UserContext);
  const posts = useLoaderData() as PostData[];
  console.log(posts);

  return (
    <>
      {session && <CreatePost />}
      <div className="grid grid-cols-1 width-xl">
        {posts?.map((post, i) => (
          <Post key={post.id} postData={post} />
        ))}
      </div>
    </>
  );
}

function Post({ postData }: { postData: PostData }) {
  const { session } = useContext(UserContext);
  return (
    <div className="flex bg-grey1 text-white m-4 border-2 rounded">
      <div className="flex-none grid grid-cols-1 place-content-center bg-gray-800 p-2 mr-4">
        <UpVote direction="up" filled={false} enabled={!!session} />
        <p className="text-center">{postData.score}</p>
        <UpVote direction="down" filled={false} enabled={!!session} />
      </div>
      <Link to={`/message-board/post/${postData.id}`} className="flex-auto">
        <p className="mt-4">
          Posted By {postData.username} {timeAgo((postData as any).created_at)}{" "}
          ago
        </p>
        <h3 className="text-2xl">{postData.title}</h3>
      </Link>
    </div>
  );
}
