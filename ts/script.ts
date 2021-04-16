import { createBoard, revealTile, markTile, TILE_STATUSES } from './logic.js'

const BOARD_SIZE = 9, MINE_COUNT = 5
let time = 0, isPlaying = true, timeInterval: number

let board = createBoard(BOARD_SIZE, MINE_COUNT)
const boardElement = <HTMLElement>document.querySelector('.board')
const gameEndText = <HTMLElement>document.querySelector('.game-end')
const minesLeftText = <HTMLElement>document.querySelector('[data-mines-left]')
const timer = <HTMLElement>document.querySelector('.time')
const replayBtn = document.querySelector('.replay-btn')

replayBtn?.addEventListener('click', () => {
    gameEndText.textContent = ''
    clearInterval(timeInterval)
    play()
})

const play = () => {
    countTime()
    isPlaying = true
    minesLeftText.textContent = MINE_COUNT + ""

    boardElement.innerHTML = ''
    boardElement.style.setProperty("--size", BOARD_SIZE + "")

    board = createBoard(BOARD_SIZE, MINE_COUNT)

    board.forEach(row => {
        row.forEach(tile => {
            boardElement?.append(tile.element)

            tile.element.addEventListener('click', () => {
                revealTile(board, tile, loseGame)
                checkWin()
            })
            tile.element.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                markTile(tile)
                countMinesLeft()
            })
        })
    })
}

const countTime = () => {
    time = 0
    timer.textContent = time + ''

    const increaseTimer = () => {
        if (isPlaying) {
            time++
            timer.textContent = time + ''
        } else {
            clearInterval(timeInterval)
        }
    }
    timeInterval = setInterval(increaseTimer, 1000)
}

const countMinesLeft = (): void => {
    const markedMines = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftText.textContent = MINE_COUNT - markedMines + ""
}

const checkWin = () => {
    const revealedCount = board.reduce((count, row) => {
        return count + row.reduce((count, tile) => {
            return count + (tile.status === TILE_STATUSES.NUMBER ? 1 : 0)
        }, 0)
    }, 0)

    const win = revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT
    if (win) {
        gameEndText.textContent = "YOU WIN!"
        isPlaying = false
        board.forEach(row => {
            row.forEach(tile => {
                tile.element.addEventListener('click', stopProp, { capture: true })
                tile.element.addEventListener('contextmenu', stopProp, { capture: true })
                tile.element.style.setProperty('transform', 'none')
            })
        })
    }
}

const loseGame = () => {
    isPlaying = false
    board.forEach(row => {
        row.forEach(tile => {
            tile.element.addEventListener('click', stopProp, { capture: true })
            tile.element.addEventListener('contextmenu', stopProp, { capture: true })
            tile.element.style.setProperty('transform', 'none')
        })
    })
    gameEndText.textContent = "YOU LOSE!"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) {
                    if (tile.mine) {
                        tile.element.style.setProperty('background-color', '#F88F32')
                    } else {
                        // tile.element.style.setProperty('background-color', '#1AD927')
                        tile.element.className = 'crossed-flag-container'
                        const cross = document.createElement('div')
                        cross.textContent = 'X'
                        cross.className = 'cross'
                        tile.element.removeChild(<Node>tile.element.firstChild)
                        tile.element.appendChild(cross)
                    }
                } else if (tile.mine) {
                    const img = document.createElement('img')
                    img.src = './assets/mine.png'
                    img.setAttribute('draggable', 'false')
                    img.className = 'mine'
                    tile.element.appendChild(img)
                    tile.status = TILE_STATUSES.MINE
                }
            })
        })
}

const stopProp = (e: Event) => {
    e.stopImmediatePropagation()
}

play()