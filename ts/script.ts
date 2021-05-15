import {
    createBoard,
    revealTile,
    markTile,
    revealMine,
    getMineTimeouts,
    randomNumber,
    TILE_STATUSES
} from './logic.js'

let BOARD_SIZE = 6, MINE_COUNT = 6
let time = 0, isPlaying = true, timeInterval: number

const container = <HTMLElement>document.querySelector('.container')
const sizeCounter = <HTMLElement>document.getElementById('board-size-counter')
const mineCountCounter = <HTMLElement>document.getElementById('mine-count-counter')
const boardSizeIncrement = document.querySelector('.next')
const boardSizeDecrement = document.querySelector('.prev')
const mineCountIncrement = document.getElementsByClassName('next')[1]
const mineCountDecrement = document.getElementsByClassName('prev')[1]
let board = createBoard(BOARD_SIZE, MINE_COUNT)
const boardElement = <HTMLElement>document.querySelector('.board')
const minesLeftText = <HTMLElement>document.querySelector('[data-mines-left]')
const timer = <HTMLElement>document.querySelector('.time')
const playBtn = document.querySelector('.play-btn')
const menuBtn = document.querySelector('.menu-btn')
const replayBtn = document.querySelector('.replay-btn')
const menu = document.querySelector('.menu')
const subText = document.querySelector('.subtext')
const gameOverWindow = <HTMLElement>document.querySelector('.game-over-window')

boardSizeIncrement?.addEventListener('click', () => {
    if (BOARD_SIZE === 10) return

    BOARD_SIZE++
    sizeCounter.innerHTML = BOARD_SIZE + ''
})

boardSizeDecrement?.addEventListener('click', () => {
    if (BOARD_SIZE === 2) return

    BOARD_SIZE--
    if (MINE_COUNT >= BOARD_SIZE*BOARD_SIZE) {
        MINE_COUNT = BOARD_SIZE*BOARD_SIZE - 1
        mineCountCounter.innerHTML = MINE_COUNT + ''
    }
    sizeCounter.innerHTML = BOARD_SIZE + '' 
})

mineCountIncrement.addEventListener('click', () => {
    if(MINE_COUNT === BOARD_SIZE*BOARD_SIZE - 1) {
        return
    }

    MINE_COUNT++
    mineCountCounter.innerHTML = MINE_COUNT+ ''
})

mineCountDecrement.addEventListener('click', () => {
    if(MINE_COUNT === 1) {
        return
    }

    MINE_COUNT--
    mineCountCounter.innerHTML = MINE_COUNT+ ''
})

menuBtn?.addEventListener('click', () => {
    clearInterval(timeInterval)

    mineCountCounter.innerHTML = MINE_COUNT + ''
    sizeCounter.innerHTML = BOARD_SIZE + ''

    container.classList.add('menu-container')

    boardElement.classList.add('hidden')
    subText?.classList.add('hidden')
    menuBtn?.classList.add('hidden')
    replayBtn?.classList.add('hidden')
    if (!gameOverWindow.classList.contains('hidden')) {
        gameOverWindow.classList.add('hidden')
    }
    menu?.classList.remove('hidden')
    playBtn?.classList.remove('hidden')
})

replayBtn?.addEventListener('click', () => {
    clearInterval(timeInterval)

    if (!gameOverWindow.classList.contains('hidden')) {
        gameOverWindow.classList.add('hidden')
    }

    play()
})

playBtn?.addEventListener('click', () => {
    menu?.classList.add('hidden')
    playBtn.classList.add('hidden')
    boardElement.classList.remove('hidden')
    subText?.classList.remove('hidden')
    menuBtn?.classList.remove('hidden')
    replayBtn?.classList.remove('hidden')
    play()
})

const play = () => {
    countTime()
    isPlaying = true
    minesLeftText.textContent = MINE_COUNT + ""

    boardElement.innerHTML = ''
    boardElement.style.setProperty('--size', BOARD_SIZE + '')
    gameOverWindow.style.setProperty('--size', BOARD_SIZE + '')
    container.classList.remove('menu-container')

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
        showWin()
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
    showLose()

    let timeouts = getMineTimeouts(MINE_COUNT)
    board.forEach(row => {
        row.forEach(tile => {
            if (tile.status === TILE_STATUSES.MARKED) {
                if (tile.mine) {
                    tile.element.style.setProperty('background-color', '#F88F32')
                } else {
                    tile.element.className = 'crossed-flag-container'
                    const cross = document.createElement('div')
                    cross.textContent = 'X'
                    cross.className = 'cross'
                    tile.element.removeChild(<Node>tile.element.firstChild)
                    tile.element.appendChild(cross)
                }
            } else if (tile.mine && !tile.element.hasChildNodes()) {
                const timeout = timeouts[randomNumber(timeouts.length - 1)]
                
                setTimeout(() => {
                    revealMine(tile)
                }, timeout)
                timeouts = timeouts.filter(t => t !== timeout)
            }
        })
    })
}

const showWin = () => {
    gameOverWindow.innerHTML = 'YOU WIN!'
    gameOverWindow.classList.remove('hidden')
}

const showLose = () => {
    gameOverWindow.innerHTML = 'YOU LOSE!'
    gameOverWindow.classList.remove('hidden')
}

const stopProp = (e: Event) => {
    e.stopImmediatePropagation()
}