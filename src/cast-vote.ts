import { supaClient } from "./supa-client";

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
  await supaClient.from("post_votes").upsert(
    {
      post_id: postId,
      user_id: userId,
      vote_type: voteType,
    },
    { onConflict: "post_id,user_id" }
  );
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
