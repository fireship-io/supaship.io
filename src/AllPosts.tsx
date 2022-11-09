import { useContext, useEffect, useMemo, useState } from "react";
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
        <UpVote
          direction="up"
          // handle filling later
          filled={false}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "up",
              onSuccess: () => {
                window.location.reload();
              },
            });
          }}
        />
        <p className="text-center" data-e2e="upvote-count">
          {postData.score}
        </p>
        <UpVote
          direction="down"
          filled={false}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "down",
              onSuccess: () => {
                window.location.reload();
              },
            });
          }}
        />
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

export async function castVote({
  postId,
  userId,
  voteType,
  onSuccess = () => {},
}: {
  postId: string;
  userId: string;
  voteType: "up" | "down";
  voteId?: Promise<string | undefined>;
  onSuccess?: () => void;
}) {
  const voteId = await getVoteId(userId, postId);
  const { data, error } = voteId
    ? await supaClient.from("post_votes").update({
        id: voteId,
        post_id: postId,
        user_id: userId,
        vote_type: voteType,
      })
    : await supaClient.from("post_votes").insert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType,
      });
  // handle error
  onSuccess();
}

export async function getVoteId(
  userId: string,
  postId: string
): Promise<string | undefined> {
  const { data, error } = await supaClient
    .from("post_votes")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .single();
  return data?.id || undefined;
}
