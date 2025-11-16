<?php
/** @var $game ?\App\Model\Game */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="game[title]" value="<?= $game ? $game->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="genre">Genre</label>
    <input type="text" id="genre" name="game[genre]" value="<?= $game ? $game->getGenre() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Release Year</label>
    <input type="number" id="year" name="game[year]" value="<?= $game ? $game->getYear() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
