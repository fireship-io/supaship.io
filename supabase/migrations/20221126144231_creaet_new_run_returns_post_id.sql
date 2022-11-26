drop function create_new_post;

create function create_new_post("userId" uuid, "title" text, "content" text)
returns uuid
language plpgsql
as $$
declare
  new_id uuid := uuid_generate_v4();
begin
  insert into "posts" ("id", "user_id", "path") values (new_id, $1, 'root');
  insert into "post_contents" ("post_id", "title", "content", "user_id") values (new_id, $2, $3, $1);
  return new_id;
end; $$;

drop function create_new_comment;

create function create_new_comment(user_id uuid, content text, path ltree)
returns uuid
language plpgsql
as $$
declare
  new_id uuid := uuid_generate_v4();
begin
  insert into posts (user_id, path, id) values ($1, $3, new_id);
  insert into post_contents (post_id, title, content, user_id) values (new_id, '', $2, $1);
  return new_id;
end; $$;