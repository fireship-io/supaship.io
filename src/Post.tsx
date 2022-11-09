import { useContext, useEffect, useMemo, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { castVote } from "./AllPosts";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";
import { UpVote } from "./UpVote";
import { SupashipUserInfo } from "./use-session";

export interface Post {
  id: string;
  author_name: string;
  title: string;
  content: string;
  score: number;
  created_at: string;
  path: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author_name: string;
  content: string;
  score: number;
  created_at: string;
  path: string;
  depth: number;
  comments: Comment[];
}

export type DepthFirstComment = Omit<Comment, "comments"> & { depth: number };

interface PostDetailData {
  post: Post | null;
  comments: DepthFirstComment[];
  myVotes?: Record<string, "up" | "down" | undefined>;
}

export async function postDetailLoader({
  params: { postId },
  userContext,
}: {
  params: { postId: string };
  userContext: SupashipUserInfo;
}) {
  const { data, error } = await supaClient
    .rpc("get_single_post_with_comments", { post_id: postId })
    .select("*");
  if (error || !data || data.length === 0) {
    throw new Error("Post not found");
  }
  const postMap = data.reduce((acc, post) => {
    acc[post.id] = post;
    return acc;
  }, {} as Record<string, Post>);
  const post = postMap[postId];
  const comments = data.filter((x) => x.id !== postId);
  if (!userContext.session?.user) {
    return { post, comments };
  }
  const { data: votesData } = await supaClient
    .from("post_votes")
    .select("*")
    .eq("user_id", userContext.session?.user.id);
  if (!votesData) {
    return;
  }
  const votes = votesData.reduce((acc, vote) => {
    acc[vote.post_id] = vote.vote_type;
    return acc;
  }, {} as Record<string, "up" | "down" | undefined>);
  return { post, comments, myVotes: votes };
}

export function PostView() {
  const userContext = useContext(UserContext);
  const params = useParams() as { postId: string };
  const [postDetailData, setPostDetailData] = useState<PostDetailData>({
    post: null,
    comments: [],
  });
  const [bumper, setBumper] = useState(0);
  useEffect(() => {
    postDetailLoader({ params, userContext }).then((newPostDetailData) => {
      if (newPostDetailData) {
        setPostDetailData(newPostDetailData);
      }
    });
  }, [userContext, params, bumper]);
  const nestedComments = useMemo(
    () => unsortedCommentsToNested(postDetailData.comments),
    [postDetailData]
  );
  return (
    <div className="flex flex-col place-content-center">
      <div className="flex text-white ml-4 my-4 border-l-2 rounded grow">
        <div className="flex flex-col bg-gray-800 p-2 h-full rounded">
          <UpVote
            direction="up"
            filled={
              postDetailData.myVotes &&
              postDetailData.post &&
              postDetailData.myVotes[postDetailData.post.id] === "up"
            }
            enabled={!!userContext.session}
            onClick={async () => {
              if (!postDetailData.post) {
                return;
              }
              await castVote({
                postId: postDetailData.post.id,
                userId: userContext.session?.user.id as string,
                voteType: "up",
                onSuccess: () => {
                  setBumper(bumper + 1);
                },
              });
            }}
          />
          <p className="text-center" data-e2e="upvote-count">
            {postDetailData.post?.score}
          </p>
          <UpVote
            direction="down"
            filled={
              postDetailData.myVotes &&
              postDetailData.post &&
              postDetailData.myVotes[postDetailData.post.id] === "down"
            }
            enabled={!!userContext.session}
            onClick={async () => {
              if (!postDetailData.post) {
                return;
              }
              await castVote({
                postId: postDetailData.post.id,
                userId: userContext.session?.user.id as string,
                voteType: "down",
                onSuccess: () => {
                  setBumper(bumper + 1);
                },
              });
            }}
          />
        </div>

        <div className="grid m-2 w-full">
          <p>
            Posted By {postDetailData.post?.author_name}{" "}
            {postDetailData.post &&
              `${timeAgo(postDetailData.post?.created_at)} ago`}
          </p>
          <h3 className="text-2xl">{postDetailData.post?.title}</h3>
          <p
            className="font-sans bg-gray-600 rounded p-4 m-4"
            data-e2e="post-content"
          >
            {postDetailData.post?.content}
          </p>
          {userContext.session && postDetailData.post && (
            <CreateComment
              parent={postDetailData.post}
              onSuccess={() => {
                setBumper(bumper + 1);
              }}
            />
          )}
          {nestedComments.map((comment) => (
            <CommentView
              key={comment.id}
              comment={comment}
              myVotes={postDetailData.myVotes}
              onVoteSuccess={() => {
                setBumper(bumper + 1);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentView({
  comment,
  myVotes,
  onVoteSuccess,
}: {
  comment: Comment;
  myVotes: Record<string, "up" | "down" | undefined> | undefined;
  onVoteSuccess: () => void;
}) {
  const [commenting, setCommenting] = useState(false);
  const { session } = useContext(UserContext);
  return (
    <>
      <div
        className="flex bg-grey1 text-white my-4 ml-4 border-l-2 rounded"
        data-e2e={`comment-${comment.id}`}
      >
        <div className="flex w-full grow">
          <div className="flex flex-col grow-0 bg-gray-800 p-2 h-full rounded">
            <UpVote
              direction="up"
              filled={myVotes?.[comment.id] === "up"}
              enabled={!!session}
              onClick={async () => {
                await castVote({
                  postId: comment.id,
                  userId: session?.user.id as string,
                  voteType: "up",
                  onSuccess: () => {
                    onVoteSuccess();
                  },
                });
              }}
            />
            <p className="text-center" data-e2e="upvote-count">
              {comment.score}
            </p>
            <UpVote
              direction="down"
              filled={myVotes?.[comment.id] === "down"}
              enabled={!!session}
              onClick={async () => {
                await castVote({
                  postId: comment.id,
                  userId: session?.user.id as string,
                  voteType: "down",
                  onSuccess: () => {
                    onVoteSuccess();
                  },
                });
              }}
            />
          </div>
          <div className="grid grid-cols-1 ml-2 my-2 w-full">
            <p>
              {comment.author_name} - {timeAgo(comment.created_at)} ago
            </p>
            <p
              className="font-sans bg-gray-600 rounded p-4 m-4"
              data-e2e="comment-content"
            >
              {comment.content}
            </p>
            {commenting && (
              <CreateComment
                parent={comment}
                onCancel={() => setCommenting(false)}
                onSuccess={() => onVoteSuccess()}
              />
            )}
            {!commenting && (
              <div className="ml-4">
                <button
                  onClick={() => setCommenting(!commenting)}
                  disabled={!session}
                >
                  {commenting ? "Cancel" : "Reply"}
                </button>
              </div>
            )}
            {/* <p>{comment.id}</p> */}
            {comment.comments.map((childComment) => (
              <CommentView
                key={childComment.id}
                comment={childComment}
                myVotes={myVotes}
                onVoteSuccess={() => onVoteSuccess()}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function CreateComment({
  parent,
  onCancel,
  onSuccess,
}: {
  parent: DepthFirstComment | Post;
  onCancel?: () => void;
  onSuccess: () => void;
}) {
  const user = useContext(UserContext);
  const [comment, setComment] = useState("");
  return (
    <>
      <form
        className="rounded border-2 p-4 mx-4 flex flex-col justify-start gap-4"
        data-e2e="create-comment-form"
        onSubmit={(event) => {
          event.preventDefault();
          supaClient
            .rpc("create_new_comment", {
              user_id: user.session?.user.id,
              content: comment,
              path: `${parent.path}.${parent.id.replaceAll("-", "_")}`,
            })
            .then(({ error }) => {
              if (error) {
                console.log(error);
              } else {
                onSuccess();
              }
            });
        }}
      >
        <h3>Add a New Comment</h3>
        <textarea
          name="comment"
          placeholder="Your comment here"
          className="text-gray-800 p-4 rounded"
          onChange={({ target: { value } }) => {
            setComment(value);
          }}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-400 rounded font-display text-lg p-2"
            disabled={!comment}
          >
            Submit
          </button>
          {onCancel && (
            <button
              type="button"
              className="bg-gray-400 rounded font-display text-lg p-2"
              onClick={() => onCancel()}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

function unsortedCommentsToNested(comments: DepthFirstComment[]): Comment[] {
  const commentMap = comments.reduce((acc, comment) => {
    acc[comment.id] = {
      ...comment,
      comments: [],
      depth: getDepth(comment.path),
    };
    return acc;
  }, {} as Record<string, Comment & { depth: number }>);
  const result: Comment[] = [];
  const sortedByDepthThenCreationTime = [...Object.values(commentMap)].sort(
    (a, b) =>
      a.depth > b.depth
        ? 1
        : a.depth < b.depth
        ? -1
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  for (const post of sortedByDepthThenCreationTime) {
    if (post.depth === 1) {
      result.push(post);
    } else {
      const parentNode = getParent(commentMap, post.path);
      parentNode.comments.push(post);
    }
  }
  return result;
}

function getParent(map: Record<string, Comment>, path: string): Comment {
  const parentId = path.replace("root.", "").split(".").slice(-1)[0];
  const parent = map[convertToUuid(parentId)];
  if (!parent) {
    throw new Error(`Parent not found at ${parentId}`);
  }
  return parent;
}

function convertToUuid(path: string): string {
  return path.replaceAll("_", "-");
}

function getDepth(path: string): number {
  const rootless = path.replace(".", "");
  return rootless.split(".").filter((x) => !!x).length;
}

// type DepthFirstComment = Omit<Comment, "comments"> & { depth: number };

// function depthFirstSearch(
//   comments: Comment[],
//   currentDepth = 0
// ): DepthFirstComment[] {
//   const result: DepthFirstComment[] = [];
//   for (const comment of comments) {
//     const temp: any = { ...comment };
//     delete temp.comments;
//     const depthFirstComment: DepthFirstComment = { ...comment, depth: currentDepth };
//     result.push(depthFirstComment);
//     res
//   }
// }
