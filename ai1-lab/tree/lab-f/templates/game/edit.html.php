<?php

/** @var \App\Model\Game $game */
/** @var \App\Service\Router $router */

$title = "Edit Game {$game->getTitle()} ({$game->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('game-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="game-edit">
        <input type="hidden" name="id" value="<?= $game->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('game-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('game-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="game-delete">
                <input type="hidden" name="id" value="<?= $game->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
