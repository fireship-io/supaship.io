create table notifications (
  id uuid primary key default uuid_generate_v4() not null,
  user_id uuid not null references auth.users(id),
  post_id uuid not null references posts(id),
  created_at timestamptz not null default now(),
  notification_text text not null,
  read_at timestamptz
);

create table notification_signups (
    id uuid primary key default uuid_generate_v4() not null,
    user_id uuid not null references auth.users(id),
    post_id uuid references posts(id),
    reason text not null,
    turned_on boolean not null default true,
    unique (user_id, post_id)
);

drop function create_new_post;

create function create_new_post("userId" uuid, "title" text, "content" text)
returns uuid
language plpgsql
as $$
declare
  new_id uuid := uuid_generate_v4();
  arow record;
  username text;
begin
  insert into "posts" ("id", "user_id", "path") values (new_id, $1, 'root');
  insert into "post_contents" ("post_id", "title", "content", "user_id") values (new_id, $2, $3, $1);
  insert into "notification_signups" ("user_id", "post_id", "reason") values ($1, new_id, 'you created the post') on conflict do nothing;
  for arow in
    select * from notification_signups where post_id = null and turned_on = true and user_id != $1
  loop
    username := (select username from user_profiles where "user_id" = $1 limit 1);
    RAISE NOTICE 'creating notification for %', username;
    insert into notifications (user_id, post_id, notification_text) values (arow.user_id, new_id, username || ' created a new post: "'  || $2 ||'"');
  end loop;
  return new_id;
end; $$;

drop function create_new_comment;

create function create_new_comment(user_id uuid, content text, path ltree)
returns uuid
language plpgsql
as $$
#variable_conflict use_column
declare
  new_id uuid := uuid_generate_v4();
  op_uuid uuid := uuid(replace(split_part(ltree2text(path), '.', 2), '_', '-'));
  arow record;
  commenter_name text;
  post_title text;
begin
  insert into posts (user_id, path, id) values ($1, $3, new_id);
  insert into post_contents (post_id, title, content, user_id) values (new_id, '', $2, $1);
  insert into notification_signups (user_id, post_id, reason) values ($1, op_uuid, 'commented on the thread') on conflict do nothing;
  for arow in 
    select * from notification_signups where "post_id" = op_uuid and turned_on = true and notification_signups.user_id != $1
  loop
    commenter_name := (select username from user_profiles where user_id = $1 limit 1);
    post_title := (select title from post_contents where "post_id" = op_uuid limit 1);
    insert into notifications (user_id, post_id, notification_text) values (arow.user_id, new_id, commenter_name || ' commented on the post: "' || post_title || '"');
  end loop;
  return new_id;
end; $$;