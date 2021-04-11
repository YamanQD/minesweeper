import { createBoard, revealTile, markTile, TILE_STATUSES } from './logic.js';
var BOARD_SIZE = 6, MINE_COUNT = 5;
var board = createBoard(BOARD_SIZE, MINE_COUNT);
var boardElement = document.querySelector('.board');
var gameEndText = document.querySelector('.game-end');
var minesLeftText = document.querySelector('[data-mines-left]');
minesLeftText.textContent = MINE_COUNT + "";
boardElement.style.setProperty("--size", BOARD_SIZE + "");
board.forEach(function (row) {
    row.forEach(function (tile) {
        boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(tile.element);
        tile.element.addEventListener('click', function () {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            markTile(tile);
            countMinesLeft();
        });
    });
});
var countMinesLeft = function () {
    var markedMines = board.reduce(function (count, row) {
        return count + row.filter(function (tile) { return tile.status === TILE_STATUSES.MARKED; }).length;
    }, 0);
    minesLeftText.textContent = MINE_COUNT - markedMines + "";
};
var checkGameEnd = function () {
    var win = checkWin();
    var lose = checkLose();
    if (lose || win) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }
    if (lose) {
        gameEndText.textContent = "YOU LOSE!";
        board.forEach(function (row) {
            row.forEach(function (tile) {
                if (tile.mine) {
                    tile.status = TILE_STATUSES.MINE;
                }
            });
        });
    }
    else if (win) {
        gameEndText.textContent = "YOU WIN!";
    }
};
var checkLose = function () {
    return board.some(function (row) {
        return row.some(function (tile) {
            return tile.status === TILE_STATUSES.MINE;
        });
    });
};
var checkWin = function () {
    var revealedCount = board.reduce(function (count, row) {
        return count + row.reduce(function (count, tile) {
            return count + (tile.status === TILE_STATUSES.NUMBER ? 1 : 0);
        }, 0);
    }, 0);
    return revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT;
};
var stopProp = function (e) {
    e.stopImmediatePropagation();
};
