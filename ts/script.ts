import {createBoard, revealTile, markTile, TILE_STATUSES} from './logic.js'

const BOARD_SIZE = 3, MINE_COUNT = 4

const board = createBoard(BOARD_SIZE, MINE_COUNT)

const boardElement = <HTMLElement> document.querySelector('.board')
const minesLeftText = <HTMLElement> document.querySelector('[data-mines-left]') 
minesLeftText.textContent = MINE_COUNT + ""

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
            countMinesLeft()
        })
    })
})

const countMinesLeft = (): void => {
    const markedMines = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftText.textContent =  MINE_COUNT - markedMines + ""
}