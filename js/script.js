import { createBoard, revealTile, markTile, TILE_STATUSES } from './logic.js';
var BOARD_SIZE = 9, MINE_COUNT = 16;
var board = createBoard(BOARD_SIZE, MINE_COUNT);
var boardElement = document.querySelector('.board');
var gameEndText = document.querySelector('.game-end');
var minesLeftText = document.querySelector('[data-mines-left]');
var replayBtn = document.querySelector('.replay-btn');
replayBtn === null || replayBtn === void 0 ? void 0 : replayBtn.addEventListener('click', function () {
    gameEndText.textContent = '';
    play();
});
var play = function () {
    minesLeftText.textContent = MINE_COUNT + "";
    boardElement.innerHTML = '';
    boardElement.style.setProperty("--size", BOARD_SIZE + "");
    board = createBoard(BOARD_SIZE, MINE_COUNT);
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
            board.forEach(function (row) {
                row.forEach(function (tile) {
                    tile.element.addEventListener('click', stopProp, { capture: true });
                    tile.element.addEventListener('contextmenu', stopProp, { capture: true });
                });
            });
        }
        if (lose) {
            gameEndText.textContent = "YOU LOSE!";
            board.forEach(function (row) {
                row.forEach(function (tile) {
                    if (tile.status === TILE_STATUSES.MARKED) {
                        if (tile.mine) {
                            tile.element.style.setProperty('background-color', '#F88F32');
                        }
                        else {
                            // tile.element.style.setProperty('background-color', '#1AD927')
                            tile.element.className = 'crossed-flag-container';
                            var cross = document.createElement('div');
                            cross.textContent = 'X';
                            cross.className = 'cross';
                            tile.element.removeChild(tile.element.firstChild);
                            tile.element.appendChild(cross);
                        }
                    }
                    else if (tile.mine) {
                        var img = document.createElement('img');
                        img.src = './assets/mine.png';
                        img.setAttribute('draggable', 'false');
                        img.className = 'mine';
                        tile.element.appendChild(img);
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
};
play();
