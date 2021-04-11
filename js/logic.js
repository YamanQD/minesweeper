var TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
};
export var createBoard = function (boardSize, numberOfMines) {
    var board = [];
    var minePositions = getMinePositions(boardSize, numberOfMines);
    var _loop_1 = function (x) {
        var row = [];
        var _loop_2 = function (y) {
            var element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;
            var tile = {
                element: element,
                x: x,
                y: y,
                mine: minePositions.filter(function (p) { return tileIsEqual({ x: x, y: y }, p); }).length != 0,
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                }
            };
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
var getMinePositions = function (boardSize, numberOfMines) {
    var positions = [];
    var _loop_3 = function () {
        var position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        };
        if (positions.filter(function (p) { return tileIsEqual(p, position); }).length === 0) {
            positions.push(position);
        }
    };
    while (positions.length < numberOfMines) {
        _loop_3();
    }
    return positions;
};
var randomNumber = function (size) {
    return Math.floor(Math.random() * size);
};
var tileIsEqual = function (tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y;
};
