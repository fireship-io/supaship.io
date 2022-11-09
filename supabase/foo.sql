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

replace function set_post_score()
returns trigger
language plpgsql
as $set_post_score$
begin
update post_score
        set score = (
            select sum(case when vote_type = 'up' then 1 else -1 end)
            from post_votes
            where post_id = new.post_id
        )
        where post_id = new.post_id;
        return new;
end;$set_post_score$

replace trigger set_post_score 
    after insert or update
    on post_votes
    for each row execute procedure set_post_score();

create function get_posts(page_number int)
returns table (
    id uuid,
    user_id uuid,
    created_at timestamp with time zone,
    title text,
    score int
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
    where p.path <@ 'root' || page_number::text
    order by p.created_at desc
    limit 10
    offset (page_number - 1) * 10;
end;$$

create function get_single_post_with_comments(post_id uuid)
returns table (
    id uuid,
    author_name uuid,
    created_at timestamp with time zone,
    title text,
    content text,
    score int,
    path ltree,
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
    where p.path <@ post_id
    -- order by p.created_at desc
    -- limit 10
    -- offset (page_number - 1) * 10;
end;$$