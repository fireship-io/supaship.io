import { EmailListSignup } from "./EmailListSignup";
import { PostView } from "./Post";

export default function Home() {
  return (
    <div className="grid place-content-center justify-center w-full">
      <h1 className="text-green-400 drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] m-4 text-center text-5xl">
        Welcome to supaship!
      </h1>
      {/* <p className="text-center font-sans drop-shadow border-gray-800 border-2 rounded-lg bg-gray-600">
        We're still launching - be on the lookout for cool stuff soon!
      </p> */}
      {/* <EmailListSignup /> */}
      <div className="grid place-items-center mt-8 w-full">
        <h2 className="text-3xl lg:text-7xl my-8 text-center">
          🎉🎉🎉 We're Live!!! 🎉🎉🎉
        </h2>
        <div className="grid lg:grid-cols-2 place-items-center gap-8 mx-8">
          <div>
            <a
              className="cursor-pointer"
              href="https://fireship.io/courses/supabase"
            >
              <img
                className="h-40 w-64 lg:w-full lg:h-96 lg:my-6 cursor-pointer object-cover lg:object-fill"
                src="https://fireship.io/courses/supabase/img/featured.webp"
              />
            </a>
          </div>
          <iframe
            className="h-40 lg:h-96 w-64 lg:w-full lg:my-6 object-cover lg:object-fill"
            src="https://www.youtube-nocookie.com/embed/zBZgdTb-dns"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="w-full">
        <PostView postId="feb6eeb3-f6f6-49f8-bbf4-2fc9ee61f86b"></PostView>
      </div>
    </div>
  );
}
