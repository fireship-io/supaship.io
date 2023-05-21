import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./App";
import { CreatePost } from "./CreatePost";
import { UpVote } from "./UpVote";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";

export interface PostData {
  id: string;
  title: string;
  score: number;
  username: string;
  user_id: string;
}

function usePageCountQuery() {
  return useQuery({
    queryKey: ["posts", "page-count"],
    queryFn: async () => {
      const { count } = await supaClient
        .from("posts")
        .select("*", { count: "exact", head: true })
        .filter("path", "eq", "root");
      return count == null ? 0 : Math.ceil(count / 10);
    },
  });
}

function useUsersPostVotes() {
  const { session } = useContext(UserContext);
  return useQuery({
    queryKey: ["posts", "user-votes", session?.user?.id],
    queryFn: async (): Promise<Record<string, "up" | "down" | undefined>> => {
      const { data: votesData } = await supaClient
        .from("post_votes")
        .select("*")
        .eq("user_id", session?.user.id);
      if (!votesData) {
        return {} as Record<string, "up" | "down" | undefined>;
      }
      const votes = votesData.reduce((acc, vote) => {
        acc[vote.post_id] = vote.vote_type;
        return acc;
      }, {} as Record<string, "up" | "down" | undefined>);
      return votes;
    },
    enabled: !!session?.user,
  });
}

function useGetPost() {
  const { pageNumber } = useParams();
  return useQuery({
    queryKey: ["posts", "page", pageNumber],
    queryFn: async () => {
      const queryPageNumber = pageNumber ? +pageNumber : 1;
      const { data } = await supaClient
        .rpc("get_posts", { page_number: queryPageNumber })
        .select("*");
      return data as PostData[];
    },
  });
}

export function AllPosts() {
  const { session } = useContext(UserContext);
  const { pageNumber } = useParams();
  const { data: totalPages = 0 } = usePageCountQuery();
  const { data: myVotes } = useUsersPostVotes();
  const { data: posts } = useGetPost();
  const queryClient = useQueryClient();

  return (
    <>
      {session && <CreatePost />}
      <Pagination
        totalPages={totalPages}
        currentPage={pageNumber ? +pageNumber : 0}
      />
      <div className="grid grid-cols-1 width-xl">
        {posts?.map((post, i) => (
          <Post
            key={post.id}
            postData={post}
            myVote={myVotes?.[post.id] || undefined}
            onVoteSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ["posts"],
              });
            }}
          />
        ))}
      </div>
    </>
  );
}

const selectedStyles = "border-2 border-white rounded p-2 bg-gray-700";
const notSelectedStyles = "rounded p-2 bg-gray-700";

function Pagination({
  totalPages,
  currentPage,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const middleButtons = [currentPage];
  for (let i = currentPage - 1; i > 0 && i > currentPage - 5; i--) {
    middleButtons.unshift(i);
  }
  for (let i = currentPage + 1; i <= totalPages && i <= currentPage + 4; i++) {
    middleButtons.push(i);
  }
  return (
    <div className="flex justify-center gap-4 place-items-end">
      {currentPage > 5 ? (
        <Link
          data-e2e={`page-1`}
          className={notSelectedStyles}
          to={`/message-board/1`}
          key={1}
        >
          1
        </Link>
      ) : (
        <></>
      )}
      {currentPage > 6 ? <span data-e2e="starting-elipsis"> ... </span> : <></>}
      {middleButtons.map((pageNumber) => (
        <Link
          key={pageNumber}
          data-e2e={`page-${pageNumber}`}
          className={
            currentPage === pageNumber ? selectedStyles : notSelectedStyles
          }
          to={`/message-board/${pageNumber}`}
        >
          {pageNumber}
        </Link>
      ))}
      {totalPages - currentPage > 5 ? (
        <span data-e2e="ending-elipsis"> ... </span>
      ) : (
        <></>
      )}
      {totalPages - currentPage > 4 ? (
        <Link
          data-e2e={`page-${totalPages}`}
          className={notSelectedStyles}
          to={`/message-board/${totalPages}`}
          key={totalPages}
        >
          {totalPages}
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}

function Post({
  postData,
  myVote,
  onVoteSuccess,
}: {
  postData: PostData;
  myVote: "up" | "down" | undefined;
  onVoteSuccess: () => void;
}) {
  const { session } = useContext(UserContext);
  return (
    <div className="flex bg-grey1 text-white m-4 border-2 rounded">
      <div className="flex-none grid grid-cols-1 place-content-center bg-gray-800 p-2 mr-4">
        <UpVote
          direction="up"
          // handle filling later
          filled={myVote === "up"}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "up",
              onSuccess: () => {
                onVoteSuccess();
              },
            });
          }}
        />
        <p className="text-center" data-e2e="upvote-count">
          {postData.score}
        </p>
        <UpVote
          direction="down"
          filled={myVote === "down"}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "down",
              onSuccess: () => {
                onVoteSuccess();
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
    ? await supaClient
        .from("post_votes")
        .update({
          post_id: postId,
          user_id: userId,
          vote_type: voteType,
        })
        .eq("id", voteId)
    : await supaClient.from("post_votes").insert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType,
      });
  // handle error
  if (!error) {
    onSuccess();
  }
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
