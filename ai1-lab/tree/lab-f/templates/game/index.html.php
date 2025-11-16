<?php

/** @var \App\Model\Game[] $games */
/** @var \App\Service\Router $router */

$title = 'Game List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Games List</h1>

    <a href="<?= $router->generatePath('game-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($games as $game): ?>
            <li><h3><?= $game->getTitle() ?> (<?= $game->getGenre() ?>, <?= $game->getYear() ?>)</h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('game-show', ['id' => $game->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('game-edit', ['id' => $game->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
