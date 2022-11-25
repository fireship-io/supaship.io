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
        <h2 className="text-7xl my-8">🎉🎉🎉 We're Live!!! 🎉🎉🎉</h2>
        <div className="grid grid-cols-2">
          <div>
            <a
              className="cursor-pointer"
              href="https://fireship.io/courses/supabase"
            >
              <img
                className="h-96 m-6 cursor-pointer"
                src="https://fireship.io/courses/supabase/img/featured.webp"
              />
            </a>
          </div>
          <div>
            <iframe
              className="m-6"
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/aXOChLn5ZdQ"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
      <div className="w-full">
        <PostView postId="f1f71e6c-dd17-4c98-b943-471997fad2ba"></PostView>
      </div>
    </div>
  );
}
