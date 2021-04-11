import { createBoard, revealTile, markTile, TILE_STATUSES } from './logic.js';
var BOARD_SIZE = 6, MINE_COUNT = 10;
var board = createBoard(BOARD_SIZE, MINE_COUNT);
var boardElement = document.querySelector('.board');
var minesLeftText = document.querySelector('[data-mines-left]');
minesLeftText.textContent = MINE_COUNT + "";
boardElement.style.setProperty("--size", BOARD_SIZE + "");
board.forEach(function (row) {
    row.forEach(function (tile) {
        boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(tile.element);
        tile.element.addEventListener('click', function () {
            revealTile(board, tile);
            checkGameOver();
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
var checkGameOver = function () {
    var gameOver = board.some(function (row) {
        return row.some(function (tile) {
            return tile.status === TILE_STATUSES.MINE;
        });
    });
    if (gameOver) {
        board.forEach(function (row) {
            row.forEach(function (tile) {
                if (tile.mine) {
                    tile.status = TILE_STATUSES.MINE;
                }
            });
        });
    }
};
