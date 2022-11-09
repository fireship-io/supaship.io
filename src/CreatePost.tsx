import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { router, UserContext } from "./App";
import { supaClient } from "./supa-client";

export interface CreatePostProps {
  newPostCreated?: () => void;
}

export function CreatePost({ newPostCreated = () => {} }: CreatePostProps) {
  const user = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <form
        className="rounded border-2 p-4 ml-4 flex flex-col justify-start gap-4 mb-8"
        onSubmit={(event) => {
          event.preventDefault();
          supaClient
            .rpc("create_new_post", {
              userId: user.session?.user.id,
              title,
              content,
            })
            .then(({ data, error }) => {
              if (error) {
                console.log(error);
              } else {
                setTitle("");
                setContent("");
                newPostCreated();
                // need to send to creaetd post later
                window.location.reload();
              }
            });
        }}
      >
        <h3>Create A New Post</h3>
        <input
          type="text"
          name="title"
          className="text-gray-800 p-2 rounded text-xl"
          placeholder="Your Title Here"
          onChange={({ target: { value } }) => {
            setTitle(value);
          }}
        />
        <textarea
          name="contents"
          placeholder="Your content here"
          className="text-gray-800 p-4 rounded h-24"
          onChange={({ target: { value } }) => {
            setContent(value);
          }}
        />
        <div>
          <button
            type="submit"
            className="bg-green-400 rounded font-display text-lg p-2"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
