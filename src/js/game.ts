declare var require: any
require('../css/main.css')

import Cell from './cell'
import Renderer from './renderer'
import Offset from './offset'

const cellSize = 10

const neighboursOffsets = [
	new Offset(-1, -1),
	new Offset(0, -1),
	new Offset(1, -1),
	new Offset(-1, 0),
	new Offset(1, 0),
	new Offset(-1, 1),
	new Offset(0, 1),
	new Offset(1, 1),
]

//state
let cells: Cell[] = []

function start(renderer : Renderer) : void {
	// Any setup that is required that only runs once before game loads goes here

	const runRender = () => {
		renderer.render(cells)
		window.requestAnimationFrame(runRender)
	}
	
	window.requestAnimationFrame(runRender)
	setInterval(gameLoop, 200) //TODO wrap game loop in function that allows ui to stop and start the game
}

function gameLoop(): void {
	addDeadNeighbours()

	cells.map((c) => {
		let count = neighboursOffsets.map(({x, y}) => cells.find((nCell) => nCell.x == c.x + x && nCell.y == c.y + y)).filter(c => c != undefined && c.alive).length

		let nextState = false

		switch (count) {
			case 0:
			case 1:
				nextState = false
				break;
			case 2:
				nextState = c.alive
				break;
			case 3:
				nextState = true
		}
		return {
			cell: c,
			newState: nextState
		}
	}).forEach(({cell, newState}) => cell.alive = newState)
}

function addDeadNeighbours() {
	for (const cell of cells.filter((c) => c.alive)) {
		for (const offset of neighboursOffsets) {
			let neighbour = cells.find((c) => c.x == cell.x + offset.x && c.y == cell.y + offset.y)
			if (!neighbour) {
				let newCell = new Cell(cell.x + offset.x, cell.y + offset.y, false)
				//connect(newCell)
				cells.push(newCell)
			}
		}
	}
}


function handleCellEvent(x : number, y: number) {

	let cell = cells.find( c => c.x == x && c.y == y)
	if (!cell) {
		let newCell = new Cell(x, y, true)
		//connect(newCell)
		cells.push(newCell)
	} else {
		cell.alive = true
	}
}

window.onload = () => {

	for (let i = 20; i < 70; i+=1) {
		for (let j = 20; j < 70; j+=1) {
			if (Math.random() < 0.5) {
				cells.push(new Cell(i, j, true))
			}
		}
	}
	
	let renderer = new Renderer(cellSize, handleCellEvent);

	start(renderer)
}