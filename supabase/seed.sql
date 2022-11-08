create extension ltree;

create table user_profiles (
  user_id uuid primary key references auth.users (id) not null,
  username text unique not null
);

create table posts (
    id uuid primary key default uuid_generate_v4() not null,
    user_id uuid references auth.users (id) not null,
    created_at timestamp with time zone default now() not null,
    path ltree not null
);

create table post_score (
    post_id uuid primary key references posts (id) not null,
    score int not null
);

create table post_contents (
    id uuid primary key default uuid_generate_v4() not null,
    post_id uuid references posts (id) not null,
    title text,
    content text,
    created_at timestamp with time zone default now() not null
);

create table post_votes (
    id uuid primary key default uuid_generate_v4() not null,
    post_id uuid references posts (id) not null,
    user_id uuid references auth.users (id) not null,
    vote_type text not null,
    unique (post_id, user_id)
);

create function update_post_score()
returns trigger
language plpgsql
as $update_post_score$
begin
update post_score
        set score = (
            select sum(case when vote_type = 'up' then 1 else -1 end)
            from post_votes
            where post_id = new.post_id
        )
        where post_id = new.post_id;
        return new;
end;$update_post_score$;

create trigger update_post_score 
    after insert or update
    on post_votes
    for each row execute procedure update_post_score();

create function get_posts(page_number int)
returns table (
    id uuid,
    user_id uuid,
    created_at timestamp with time zone,
    title text,
    score int,
    username text
)
language plpgsql
as $$
begin
    return query
    select posts.id, posts.user_id, posts.created_at, post_contents.title, post_score.score, user_profiles.username
    from posts
    join post_contents on posts.id = post_contents.post_id
    join post_score on posts.id = post_score.post_id
    join user_profiles on posts.user_id = user_profiles.user_id
    order by posts.created_at desc
    limit 10
    offset (page_number - 1) * 10;
end;$$;

create function create_new_post("userId" uuid, "title" text, "content" text)
returns boolean
language plpgsql
as $$
begin
  with
    "inserted_post" as (
      insert into "posts" ("user_id", "path")
      values ($1, 'root')
      returning "id"
    )
  insert into "post_contents" ("post_id", "title", "content")
  values ((select "id" from "inserted_post"), $2, $3);
  return true;
end; $$;

create function initialize_post_score()
returns trigger
language plpgsql
as $initialize_post_score$
begin
    insert into post_score (post_id, score)
    values (new.id, 0);
    return new;
end;$initialize_post_score$;

create trigger initialize_post_score 
    after insert
    on posts
    for each row execute procedure initialize_post_score();

-- CREATE POLICY "can see all" ON "public"."user_profiles"
-- AS PERMISSIVE FOR SELECT
-- TO public
-- USING (true);

-- CREATE POLICY "can only insert your own" ON "public"."user_profiles"
-- AS PERMISSIVE FOR INSERT
-- TO public

-- WITH CHECK ((auth.uid()=user_id));

-- CREATE POLICY "can only insert your own" ON "public"."user_profiles"
-- AS PERMISSIVE FOR INSERT
-- TO public

-- WITH CHECK ((auth.uid() = user_id));

-- CREATE POLICY "can only update your own" ON "public"."user_profiles"
-- AS PERMISSIVE FOR UPDATE
-- TO public
-- USING ((auth.uid() = user_id))
-- WITH CHECK ((auth.uid() = user_id));