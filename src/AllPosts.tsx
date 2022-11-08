import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";

interface PostData {
  id: string;
  title: string;
  score: number;
  username: string;
  user_id: string;
}

export async function postLoader({
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
    <div className="grid grid-cols-1 width-xl">
      {posts?.map((post, i) => (
        <Post key={post.id} postData={post} />
      ))}
    </div>
  );
}

function Post({ postData }: { postData: PostData }) {
  return (
    <div className="flex bg-grey1 text-white m-4 p-2 border-2 rounded">
      <div className="flex-none grid grid-cols-1 place-content-center bg-gray-100 p-2">
        <button>
          <UpVote direction="up" filled={false} />
        </button>
        <p className="text-center">{postData.score}</p>
        <button>
          <UpVote direction="down" filled={false} />
        </button>
      </div>
      <Link to={`/message-board/post/${postData.id}`} className="flex-auto">
        <p>
          Posted By {postData.username} {timeAgo((postData as any).created_at)}{" "}
          ago
        </p>
        <h3 className="text-2xl">{postData.title}</h3>
      </Link>
    </div>
  );
}

function UpVote(
  {
    direction = "up",
    filled = false,
  }: {
    direction: "up" | "down";
    filled: boolean;
  } = {} as any
) {
  const classes = ["fill-white"];
  if (direction === "down") {
    classes.push("origin-center rotate-180");
  }
  return (
    <svg
      className={classes.join(" ")}
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
    </svg>
  );
}

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
