<?php
namespace App\Model;

use App\Service\Config;

class Game
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $genre = null;
    private ?int $year = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Game
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Game
    {
        $this->title = $title;
        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(?string $genre): Game
    {
        $this->genre = $genre;
        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): Game
    {
        $this->year = $year;
        return $this;
    }

    public static function fromArray($array): Game
    {
        $game = new self();
        $game->fill($array);
        return $game;
    }

    public function fill($array): Game
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['genre'])) {
            $this->setGenre($array['genre']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM game';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $games = [];
        $gamesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($gamesArray as $gameArray) {
            $games[] = self::fromArray($gameArray);
        }
        return $games;
    }

    public static function find($id): ?Game
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM game WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $gameArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $gameArray) {
            return null;
        }
        return self::fromArray($gameArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO game (title, genre, year) VALUES (:title, :genre, :year)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'genre' => $this->getGenre(),
                'year' => $this->getYear(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE game SET title = :title, genre = :genre, year = :year WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':genre' => $this->getGenre(),
                ':year' => $this->getYear(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM game WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setGenre(null);
        $this->setYear(null);
    }
}
