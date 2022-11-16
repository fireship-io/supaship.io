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
  const voteId = await getVoteId(userId, postId);
  if (voteId) {
    await supaClient.from("post_votes").update({
      id: voteId,
      post_id: postId,
      user_id: userId,
      vote_type: voteType,
    });
  } else {
    await supaClient.from("post_votes").insert({
      post_id: postId,
      user_id: userId,
      vote_type: voteType,
    });
  }
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
