export var TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
};
export var TILE_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
export var createBoard = function (boardSize, numberOfMines) {
    var board = [];
    var minePositions = getMinePositions(boardSize, numberOfMines);
    var _loop_1 = function (x) {
        var row = [];
        var _loop_2 = function (y) {
            var element = document.createElement('div');
            var tile = {
                element: element,
                x: x,
                y: y,
                mine: minePositions.filter(function (p) { return positionIsEqual({ x: x, y: y }, p); }).length != 0,
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                },
                get num() {
                    return this.element.dataset.num;
                },
                set num(value) {
                    this.element.dataset.num = value;
                }
            };
            tile.status = TILE_STATUSES.HIDDEN;
            row.push(tile);
        };
        for (var y = 0; y < boardSize; y++) {
            _loop_2(y);
        }
        board.push(row);
    };
    for (var x = 0; x < boardSize; x++) {
        _loop_1(x);
    }
    return board;
};
export var randomNumber = function (size) {
    return Math.floor(Math.random() * size);
};
export var revealTile = function (board, tile, handleLose) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return;
    }
    if (tile.mine) {
        revealMine(tile);
        return handleLose();
    }
    tile.status = TILE_STATUSES.NUMBER;
    var nearbyTiles = getNearbyTiles(board, { x: tile.x, y: tile.y });
    var nearbyMines = nearbyTiles.reduce(function (count, t) {
        return count + (t.mine ? 1 : 0);
    }, 0);
    tile.num = TILE_NUMBERS[nearbyMines];
    if (nearbyMines) {
        tile.element.textContent = nearbyMines + "";
    }
    else {
        nearbyTiles.forEach(function (t) { return revealTile(board, t, handleLose); });
    }
};
export var markTile = function (tile) {
    if (tile.status === TILE_STATUSES.HIDDEN) {
        showFlag(tile);
    }
    else if (tile.status === TILE_STATUSES.MARKED) {
        hideFlag(tile);
    }
};
export var revealMine = function (tile) {
    var img = document.createElement('img');
    img.src = './assets/mine.png';
    img.setAttribute('draggable', 'false');
    img.classList.add('mine_small');
    tile.element.appendChild(img);
    setTimeout(function () {
        img.classList.add('mine_large');
    }, 10);
    setTimeout(function () {
        tile.status = TILE_STATUSES.MINE;
    }, 50);
};
export var getMineTimeouts = function (mineCount) {
    var timeouts = [];
    for (var timeout = 200; timeout < mineCount * 200; timeout += 200) {
        timeouts.push(timeout);
    }
    return timeouts;
};
var getMinePositions = function (boardSize, numberOfMines) {
    var positions = [];
    var _loop_3 = function () {
        var position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        };
        if (positions.filter(function (p) { return positionIsEqual(p, position); }).length === 0) {
            positions.push(position);
        }
    };
    while (positions.length < numberOfMines) {
        _loop_3();
    }
    return positions;
};
var positionIsEqual = function (tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y;
};
var getNearbyTiles = function (board, _a) {
    var _b;
    var x = _a.x, y = _a.y;
    var tiles = [];
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
        for (var yOffset = -1; yOffset <= 1; yOffset++) {
            var tile = (_b = board[x + xOffset]) === null || _b === void 0 ? void 0 : _b[y + yOffset];
            if (tile) {
                tiles.push(tile);
            }
        }
    }
    return tiles;
};
var showFlag = function (tile) {
    var img = document.createElement('img');
    img.src = './assets/flag.png';
    img.setAttribute('draggable', 'false');
    img.classList.add('flag_small');
    tile.element.appendChild(img);
    tile.status = TILE_STATUSES.MARKED;
    setTimeout(function () {
        img.classList.add('flag_large');
    }, 10);
};
var hideFlag = function (tile) {
    var _a;
    (_a = tile.element.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList.remove('flag_large');
    setTimeout(function () {
        tile.status = TILE_STATUSES.HIDDEN;
        tile.element.removeChild(tile.element.firstChild);
    }, 60);
};
