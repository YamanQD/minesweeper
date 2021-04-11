import {createBoard} from './logic.js'

const BOARD_SIZE = 3, MINE_COUNT = 4

const board = createBoard(BOARD_SIZE, MINE_COUNT)

const boardElement = <Element> document.querySelector('.board')

board.forEach(row => {
    row.forEach(tile => {
        boardElement?.append(tile.element)
    })
})