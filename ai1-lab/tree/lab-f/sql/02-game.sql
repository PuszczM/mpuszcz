create table game
(
    id      integer not null
        constraint game_pk
            primary key autoincrement,
    title text not null,
    genre text not null,
    year integer not null
);
