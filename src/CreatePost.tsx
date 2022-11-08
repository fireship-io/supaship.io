import { useContext, useState } from "react";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";

export interface CreatePostProps {
  newPostCreated?: () => void;
}

export function CreatePost({ newPostCreated = () => {} }: CreatePostProps) {
  const user = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  return (
    <>
      <form
        className="rounded border-2"
        onSubmit={(event) => {
          event.preventDefault();
          supaClient
            .rpc("create_new_post", {
              userId: user.session?.user.id,
              title,
              content,
            })
            .then(({ error }) => {
              if (error) {
                console.log(error);
              } else {
                setTitle("");
                setContent("");
                newPostCreated();
              }
            });
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={({ target: { value } }) => {
            setTitle(value);
          }}
        />
        <textarea
          name="contents"
          placeholder="Your contents here"
          onChange={({ target: { value } }) => {
            setContent(value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
