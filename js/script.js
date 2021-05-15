import { createBoard, revealTile, markTile, revealMine, getMineTimeouts, randomNumber, TILE_STATUSES } from './logic.js';
var BOARD_SIZE = 6, MINE_COUNT = 6;
var time = 0, isPlaying = true, timeInterval;
var container = document.querySelector('.container');
var sizeCounter = document.getElementById('board-size-counter');
var mineCountCounter = document.getElementById('mine-count-counter');
var boardSizeIncrement = document.querySelector('.next');
var boardSizeDecrement = document.querySelector('.prev');
var mineCountIncrement = document.getElementsByClassName('next')[1];
var mineCountDecrement = document.getElementsByClassName('prev')[1];
var board = createBoard(BOARD_SIZE, MINE_COUNT);
var boardElement = document.querySelector('.board');
var minesLeftText = document.querySelector('[data-mines-left]');
var timer = document.querySelector('.time');
var playBtn = document.querySelector('.play-btn');
var menuBtn = document.querySelector('.menu-btn');
var replayBtn = document.querySelector('.replay-btn');
var menu = document.querySelector('.menu');
var subText = document.querySelector('.subtext');
var gameOverWindow = document.querySelector('.game-over-window');
boardSizeIncrement === null || boardSizeIncrement === void 0 ? void 0 : boardSizeIncrement.addEventListener('click', function () {
    if (BOARD_SIZE === 10)
        return;
    BOARD_SIZE++;
    sizeCounter.innerHTML = BOARD_SIZE + '';
});
boardSizeDecrement === null || boardSizeDecrement === void 0 ? void 0 : boardSizeDecrement.addEventListener('click', function () {
    if (BOARD_SIZE === 2)
        return;
    BOARD_SIZE--;
    if (MINE_COUNT >= BOARD_SIZE * BOARD_SIZE) {
        MINE_COUNT = BOARD_SIZE * BOARD_SIZE - 1;
        mineCountCounter.innerHTML = MINE_COUNT + '';
    }
    sizeCounter.innerHTML = BOARD_SIZE + '';
});
mineCountIncrement.addEventListener('click', function () {
    if (MINE_COUNT === BOARD_SIZE * BOARD_SIZE - 1) {
        return;
    }
    MINE_COUNT++;
    mineCountCounter.innerHTML = MINE_COUNT + '';
});
mineCountDecrement.addEventListener('click', function () {
    if (MINE_COUNT === 1) {
        return;
    }
    MINE_COUNT--;
    mineCountCounter.innerHTML = MINE_COUNT + '';
});
menuBtn === null || menuBtn === void 0 ? void 0 : menuBtn.addEventListener('click', function () {
    clearInterval(timeInterval);
    mineCountCounter.innerHTML = MINE_COUNT + '';
    sizeCounter.innerHTML = BOARD_SIZE + '';
    boardElement.classList.add('hidden');
    subText === null || subText === void 0 ? void 0 : subText.classList.add('hidden');
    menuBtn === null || menuBtn === void 0 ? void 0 : menuBtn.classList.add('hidden');
    replayBtn === null || replayBtn === void 0 ? void 0 : replayBtn.classList.add('hidden');
    if (!gameOverWindow.classList.contains('hidden')) {
        gameOverWindow.classList.add('hidden');
    }
    menu === null || menu === void 0 ? void 0 : menu.classList.remove('hidden');
    playBtn === null || playBtn === void 0 ? void 0 : playBtn.classList.remove('hidden');
    container.classList.add('menu-container');
});
replayBtn === null || replayBtn === void 0 ? void 0 : replayBtn.addEventListener('click', function () {
    clearInterval(timeInterval);
    if (!gameOverWindow.classList.contains('hidden')) {
        gameOverWindow.classList.add('hidden');
    }
    play();
});
playBtn === null || playBtn === void 0 ? void 0 : playBtn.addEventListener('click', function () {
    menu === null || menu === void 0 ? void 0 : menu.classList.add('hidden');
    playBtn.classList.add('hidden');
    boardElement.classList.remove('hidden');
    subText === null || subText === void 0 ? void 0 : subText.classList.remove('hidden');
    menuBtn === null || menuBtn === void 0 ? void 0 : menuBtn.classList.remove('hidden');
    replayBtn === null || replayBtn === void 0 ? void 0 : replayBtn.classList.remove('hidden');
    container.classList.remove('menu-container');
    play();
});
var play = function () {
    countTime();
    isPlaying = true;
    minesLeftText.textContent = MINE_COUNT + "";
    boardElement.innerHTML = '';
    boardElement.style.setProperty('--size', BOARD_SIZE + '');
    gameOverWindow.style.setProperty('--size', BOARD_SIZE + '');
    board = createBoard(BOARD_SIZE, MINE_COUNT);
    board.forEach(function (row) {
        row.forEach(function (tile) {
            boardElement === null || boardElement === void 0 ? void 0 : boardElement.append(tile.element);
            tile.element.addEventListener('click', function () {
                revealTile(board, tile, loseGame);
                checkWin();
            });
            tile.element.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                markTile(tile);
                countMinesLeft();
            });
        });
    });
};
var countTime = function () {
    time = 0;
    timer.textContent = time + '';
    var increaseTimer = function () {
        if (isPlaying) {
            time++;
            timer.textContent = time + '';
        }
        else {
            clearInterval(timeInterval);
        }
    };
    timeInterval = setInterval(increaseTimer, 1000);
};
var countMinesLeft = function () {
    var markedMines = board.reduce(function (count, row) {
        return count + row.filter(function (tile) { return tile.status === TILE_STATUSES.MARKED; }).length;
    }, 0);
    minesLeftText.textContent = MINE_COUNT - markedMines + "";
};
var checkWin = function () {
    var revealedCount = board.reduce(function (count, row) {
        return count + row.reduce(function (count, tile) {
            return count + (tile.status === TILE_STATUSES.NUMBER ? 1 : 0);
        }, 0);
    }, 0);
    var win = revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT;
    if (win) {
        showWin();
        isPlaying = false;
        board.forEach(function (row) {
            row.forEach(function (tile) {
                tile.element.addEventListener('click', stopProp, { capture: true });
                tile.element.addEventListener('contextmenu', stopProp, { capture: true });
                tile.element.style.setProperty('transform', 'none');
            });
        });
    }
};
var loseGame = function () {
    isPlaying = false;
    board.forEach(function (row) {
        row.forEach(function (tile) {
            tile.element.addEventListener('click', stopProp, { capture: true });
            tile.element.addEventListener('contextmenu', stopProp, { capture: true });
            tile.element.style.setProperty('transform', 'none');
        });
    });
    showLose();
    var timeouts = getMineTimeouts(MINE_COUNT);
    board.forEach(function (row) {
        row.forEach(function (tile) {
            if (tile.status === TILE_STATUSES.MARKED) {
                if (tile.mine) {
                    tile.element.style.setProperty('background-color', '#F88F32');
                }
                else {
                    tile.element.className = 'crossed-flag-container';
                    var cross = document.createElement('div');
                    cross.textContent = 'X';
                    cross.className = 'cross';
                    tile.element.removeChild(tile.element.firstChild);
                    tile.element.appendChild(cross);
                }
            }
            else if (tile.mine && !tile.element.hasChildNodes()) {
                var timeout_1 = timeouts[randomNumber(timeouts.length - 1)];
                setTimeout(function () {
                    revealMine(tile);
                }, timeout_1);
                timeouts = timeouts.filter(function (t) { return t !== timeout_1; });
            }
        });
    });
};
var showWin = function () {
    gameOverWindow.innerHTML = 'YOU WIN!';
    gameOverWindow.classList.remove('hidden');
    gameOverWindow.style.color = 'rgb(0,200,0)';
};
var showLose = function () {
    gameOverWindow.innerHTML = 'YOU LOSE!';
    gameOverWindow.classList.remove('hidden');
    gameOverWindow.style.color = 'rgb(238, 89, 89)';
};
var stopProp = function (e) {
    e.stopImmediatePropagation();
};
