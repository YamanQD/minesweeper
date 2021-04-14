type tile = {
	element: HTMLElement,
	x: number,
	y: number,
	mine: boolean,
	status: string,
	num: string | undefined
}

export const TILE_STATUSES = {
	HIDDEN: 'hidden',
	MINE: 'mine',
	NUMBER: 'number',
	MARKED: 'marked'
}

export const TILE_NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8']

export const createBoard = (boardSize: number, numberOfMines: number): tile[][] => {
	const board = []
	const minePositions: { x: number, y: number }[] = getMinePositions(boardSize, numberOfMines)

	for (let x = 0; x < boardSize; x++) {
		const row = []
		for (let y = 0; y < boardSize; y++) {
			const element = document.createElement('div')

			const tile = {
				element,
				x,
				y,
				mine: minePositions.filter(p => positionIsEqual({ x, y }, p)).length != 0,
				get status(): string {
					return <string>this.element.dataset.status
				},
				set status(value: string) {
					this.element.dataset.status = value
				},
				get num(): string | undefined {
					return this.element.dataset.num
				},
				set num(value: string | undefined) {
					this.element.dataset.num = value
				}
			}
			tile.status = TILE_STATUSES.HIDDEN
			row.push(tile)
		}
		board.push(row)
	}
	return board
}

const getMinePositions = (boardSize: number, numberOfMines: number): { x: number, y: number }[] => {
	const positions: { x: number, y: number }[] = []

	while (positions.length < numberOfMines) {
		const position = {
			x: randomNumber(boardSize),
			y: randomNumber(boardSize)
		}

		if (positions.filter(p => positionIsEqual(p, position)).length === 0) {
			positions.push(position)
		}
	}

	return positions
}

const randomNumber = (size: number): number => {
	return Math.floor(Math.random() * size)
}

const positionIsEqual = (tile1: any, tile2: any): boolean => {
	return tile1.x === tile2.x && tile1.y === tile2.y
}

export const revealTile = (board: tile[][], tile: tile): void => {
	if (tile.status !== TILE_STATUSES.HIDDEN) {
		return
	}
	if (tile.mine) {
		tile.status = TILE_STATUSES.MINE
		return
	}

	tile.status = TILE_STATUSES.NUMBER

	const nearbyTiles = getNearbyTiles(board, { x: tile.x, y: tile.y })
	const nearbyMines = nearbyTiles.reduce((count, t) => {
		return count + (t.mine ? 1 : 0)
	}, 0)

	tile.num = TILE_NUMBERS[nearbyMines]

	if (nearbyMines) {
		tile.element.textContent = nearbyMines + ""
	} else {
		nearbyTiles.forEach(t => revealTile(board, t))
	}
}

export const markTile = (tile: tile) => {
	if (tile.status === TILE_STATUSES.HIDDEN) {
		tile.status = TILE_STATUSES.MARKED

		const img = document.createElement('img')
		img.src = './assets/flag.png'
		img.className = 'flag'
		img.setAttribute('draggable', 'false')

		tile.element.appendChild(img)
	} else if (tile.status === TILE_STATUSES.MARKED) {
		tile.status = TILE_STATUSES.HIDDEN
		tile.element.removeChild(<Node>tile.element.firstChild)
	}
}

const getNearbyTiles = (board: tile[][], { x, y }: { x: number, y: number }): tile[] => {
	const tiles: tile[] = []

	for (let xOffset = -1; xOffset <= 1; xOffset++) {
		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			const tile = board[x + xOffset]?.[y + yOffset]
			if (tile) {
				tiles.push(tile)
			}
		}
	}
	return tiles
}