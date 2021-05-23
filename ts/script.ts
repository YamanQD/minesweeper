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
let board = createBoard(BOARD_SIZE, MINE_COUNT)

const container = <HTMLElement> document.querySelector('.container'),
    sizeCounter = <HTMLElement> document.getElementById('board-size-counter'), //Menu screen board size text
    mineCountCounter = <HTMLElement>document.getElementById('mine-count-counter'), //Menu screen mine count text
    boardSizeIncrement = <HTMLElement> document.querySelector('.next'), //Menu screen board size right button
    boardSizeDecrement = <HTMLElement> document.querySelector('.prev'), //Menu screen board size left button
    mineCountIncrement = <HTMLElement> document.getElementsByClassName('next')[1], //Menu screen mine count right button
    mineCountDecrement = <HTMLElement> document.getElementsByClassName('prev')[1], //Menu screen mine count left button
    boardElement = <HTMLElement> document.querySelector('.board'),
    minesLeftText = <HTMLElement> document.querySelector('[data-mines-left]'),
    timer = <HTMLElement> document.querySelector('.time'),
    playBtn = <HTMLElement> document.querySelector('.play-btn'),
    menuBtn = <HTMLElement> document.querySelector('.menu-btn'),
    replayBtn = <HTMLElement> document.querySelector('.replay-btn'),
    menu = <HTMLElement> document.querySelector('.menu'),
    subText = <HTMLElement> document.querySelector('.subtext'), //Game screen mines left and time counters
    gameOverWindow = <HTMLElement> document.querySelector('.game-over-window')

const addEventListeners = () => {
    boardSizeIncrement.addEventListener('click', () => {
        if (BOARD_SIZE === 9) return

        BOARD_SIZE++
        sizeCounter.innerHTML = BOARD_SIZE + ''
    })

    boardSizeDecrement.addEventListener('click', () => {
        if (BOARD_SIZE === 4) return

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

    menuBtn.addEventListener('click', () => {
        clearInterval(timeInterval)

        mineCountCounter.innerHTML = MINE_COUNT + ''
        sizeCounter.innerHTML = BOARD_SIZE + ''

        boardElement.classList.add('hidden')
        subText.classList.add('hidden')
        menuBtn.classList.add('hidden')
        replayBtn.classList.add('hidden')
        if (!gameOverWindow.classList.contains('hidden')) {
            gameOverWindow.classList.add('hidden')
        }
        menu.classList.remove('hidden')
        playBtn.classList.remove('hidden')

        container.classList.add('menu-container')
    })

    replayBtn.addEventListener('click', () => {
        clearInterval(timeInterval)

        if (!gameOverWindow.classList.contains('hidden')) {
            gameOverWindow.classList.add('hidden')
        }

        play()
    })

    playBtn.addEventListener('click', () => {
        menu.classList.add('hidden')
        playBtn.classList.add('hidden')
        boardElement.classList.remove('hidden')
        subText.classList.remove('hidden')
        menuBtn.classList.remove('hidden')
        replayBtn.classList.remove('hidden')

        container.classList.remove('menu-container')
        play()
    })
}

const play = () => {
    countTime()
    isPlaying = true
    minesLeftText.textContent = MINE_COUNT + ""

    boardElement.innerHTML = ''
    boardElement.style.setProperty('--size', BOARD_SIZE + '')
    gameOverWindow.style.setProperty('--size', BOARD_SIZE + '')

    board = createBoard(BOARD_SIZE, MINE_COUNT)

    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)

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
    gameOverWindow.style.color = 'rgb(0,200,0)'
}

const showLose = () => {
    gameOverWindow.innerHTML = 'YOU LOSE!'
    gameOverWindow.classList.remove('hidden')
    gameOverWindow.style.color = 'rgb(238, 89, 89)'
}

const stopProp = (e: Event) => {
    e.stopImmediatePropagation()
}

addEventListeners()