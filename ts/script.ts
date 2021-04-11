import { createBoard, revealTile, markTile, TILE_STATUSES } from './logic.js'

const BOARD_SIZE = 6, MINE_COUNT = 5

const board = createBoard(BOARD_SIZE, MINE_COUNT)
const boardElement = <HTMLElement> document.querySelector('.board')
const gameEndText = <HTMLElement> document.querySelector('.game-end')
const minesLeftText = <HTMLElement> document.querySelector('[data-mines-left]')
minesLeftText.textContent = MINE_COUNT + ""

boardElement.style.setProperty("--size", BOARD_SIZE + "")

board.forEach(row => {
    row.forEach(tile => {
        boardElement?.append(tile.element)

        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameEnd()
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

    minesLeftText.textContent = MINE_COUNT - markedMines + ""
}

const checkGameEnd = (): void => {
    const win = checkWin()
    const lose = checkLose()

    if(lose || win) {
        boardElement.addEventListener("click", stopProp, { capture: true })
        boardElement.addEventListener("contextmenu", stopProp, { capture: true })
    }

    if (lose) {
        gameEndText.textContent = "YOU LOSE!"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.mine) {
                    tile.status = TILE_STATUSES.MINE
                }
            })
        })
    } else if (win) {
        gameEndText.textContent = "YOU WIN!"
    }
}

const checkLose = () => {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

const checkWin = () => {
    const revealedCount = board.reduce((count, row) => {
        return count + row.reduce((count, tile) => {
            return count + (tile.status === TILE_STATUSES.NUMBER ? 1: 0)
        }, 0)
    }, 0)

    return revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT 
}

const stopProp = (e: Event) => {
    e.stopImmediatePropagation()
}