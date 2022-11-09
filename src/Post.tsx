import { useContext, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";
import { UpVote } from "./UpVote";

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

interface PostDetailLoaderData {
  post: Post;
  comments: DepthFirstComment[];
}

export async function postDetailLoader({
  params: { postId },
}: {
  params: { postId: string };
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
  return { post, comments };
}

export function PostView() {
  const { session } = useContext(UserContext);
  const { post, comments } = useLoaderData() as PostDetailLoaderData;
  const nestedComments = useMemo(
    () => unsortedCommentsToNested(comments),
    [comments]
  );
  return (
    <div className="flex flex-col place-content-center">
      <div className="flex text-white ml-4 my-4 border-l-2 rounded grow">
        <div className="flex flex-col bg-gray-800 p-2 h-full rounded">
          <button>
            <UpVote direction="up" filled={false} />
          </button>
          <p className="text-center">{post.score}</p>
          <button>
            <UpVote direction="down" filled={false} />
          </button>
        </div>

        <div className="grid m-2 w-full">
          <p>
            Posted By {post.author_name} {timeAgo(post.created_at)} ago
          </p>
          <h3 className="text-2xl">{post.title}</h3>
          <p className="font-sans bg-gray-600 rounded p-4 m-4">
            {post.content}
          </p>
          <CreateComment parent={post} />
          {nestedComments.map((comment) => (
            <CommentView key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentView({ comment }: { comment: Comment }) {
  const [commenting, setCommenting] = useState(false);
  return (
    <>
      <div className="flex bg-grey1 text-white my-4 ml-4 border-l-2 rounded">
        {/* {new Array(comment.depth).fill(0).map((_, i) => (
          <div key={i} className="w-4" />
        ))} */}
        <div className="flex w-full grow">
          <div className="flex flex-col grow-0 bg-gray-800 p-2 h-full rounded">
            <button>
              <UpVote direction="up" filled={false} />
            </button>
            <p className="text-center">{comment.score}</p>
            <button>
              <UpVote direction="down" filled={false} />
            </button>
          </div>
          <div className="grid grid-cols-1 ml-2 my-2 w-full">
            <p>
              {comment.author_name} - {timeAgo(comment.created_at)} ago
            </p>
            <p className="font-sans bg-gray-600 rounded p-4 m-4">
              {comment.content}
            </p>
            {commenting && (
              <CreateComment
                parent={comment}
                onCancel={() => setCommenting(false)}
              />
            )}
            {!commenting && (
              <div className="ml-4">
                <button onClick={() => setCommenting(!commenting)}>
                  {commenting ? "Cancel" : "Reply"}
                </button>
              </div>
            )}
            {/* <p>{comment.id}</p> */}
            {comment.comments.map((childComment) => (
              <CommentView key={childComment.id} comment={childComment} />
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
}: {
  parent: DepthFirstComment | Post;
  onCancel?: () => void;
}) {
  const user = useContext(UserContext);
  const [comment, setComment] = useState("");
  return (
    <>
      <form
        className="rounded border-2 p-4 mx-4 flex flex-col justify-start gap-4"
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
                window.location.reload();
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
