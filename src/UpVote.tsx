export function UpVote(
  {
    direction = "up",
    filled = false,
    enabled = true,
  }: {
    direction: "up" | "down";
    filled?: boolean;
    enabled?: boolean;
  } = {} as any
) {
  const classes = ["fill-white"];
  if (direction === "down") {
    classes.push("origin-center rotate-180");
  }
  return (
    <button disabled={!enabled}>
      <svg
        className={classes.join(" ")}
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        data-e2e={direction === "up" ? "upvote" : "downvote"}
      >
        <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
      </svg>
    </button>
  );
}
