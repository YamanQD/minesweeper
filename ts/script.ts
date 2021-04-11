import {createBoard, revealTile, markTile} from './logic.js'

const BOARD_SIZE = 3, MINE_COUNT = 4

const board = createBoard(BOARD_SIZE, MINE_COUNT)

const boardElement = <HTMLElement> document.querySelector('.board')
boardElement.style.setProperty("--size", BOARD_SIZE + "")

board.forEach(row => {
    row.forEach(tile => {
        boardElement?.append(tile.element)

        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
        })
        tile.element.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            markTile(tile)
        })
    })
})
