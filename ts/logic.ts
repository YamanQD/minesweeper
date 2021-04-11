export type tileType = {
	element: HTMLElement,
	x: number,
	y: number,
	mine: boolean,
	status: string
}

export const TILE_STATUSES = {
	HIDDEN: 'hidden',
	MINE: 'mine',
	NUMBER: 'number',
	MARKED: 'marked'
}

export const createBoard = (boardSize: number, numberOfMines: number): tileType[][] => {
	const board = []
	const minePositions: {x: number, y: number}[] = getMinePositions(boardSize, numberOfMines)

	for (let x = 0; x < boardSize; x++) {
		const row = []
		for (let y = 0; y < boardSize; y++) {
			const element = document.createElement('div')

			const tile = {
				element,
				x,
				y,
				mine: minePositions.filter(p => positionIsEqual({x,y}, p)).length != 0,
				get status(): string {
					return <string> this.element.dataset.status
				},
				set status(value: string) {
					this.element.dataset.status = value
				}
			}
			tile.status = TILE_STATUSES.HIDDEN
			row.push(tile)
		}
		board.push(row)
  }
	return board
}

const getMinePositions = (boardSize: number, numberOfMines: number): {x: number, y: number}[] => {
	const positions: {x: number, y: number}[] = []

	while(positions.length < numberOfMines) {
		const position = {
			x: randomNumber(boardSize),
			y: randomNumber(boardSize)
		}

		if(positions.filter(p => positionIsEqual(p, position)).length === 0) {
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

export const revealTile = (board: tileType[][], tile: tileType): void => {
	if(!(tile.status === TILE_STATUSES.HIDDEN)) {
		return
	}

    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
    } else {
        tile.status = TILE_STATUSES.NUMBER
    }
}

export const markTile = (tile: tileType) => {
	if (tile.status === TILE_STATUSES.HIDDEN) {
		tile.status = TILE_STATUSES.MARKED
	} else if (tile.status === TILE_STATUSES.MARKED) {
		tile.status = TILE_STATUSES.HIDDEN
	}
}