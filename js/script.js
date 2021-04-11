import { createBoard, revealTile, markTile } from './logic.js';
var BOARD_SIZE = 3, MINE_COUNT = 4;
var board = createBoard(BOARD_SIZE, MINE_COUNT);
var boardElement = document.querySelector('.board');
boardElement.style.setProperty("--size", BOARD_SIZE + "");
board.forEach(function (row) {
    row.forEach(function (tile) {
        boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(tile.element);
        tile.element.addEventListener('click', function () {
            revealTile(board, tile);
        });
        tile.element.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            markTile(tile);
        });
    });
});
