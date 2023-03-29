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

let playing = true
let drawing = true
let interval = 200

function start(renderer : Renderer) : void {
	// Any setup that is required that only runs once before game loads goes here

	const runRender = () => {
		renderer.render(cells)
		window.requestAnimationFrame(runRender)
	}
	
	window.requestAnimationFrame(runRender)
	gameLoop()
}

function gameLoop(): void {
	if (playing) {
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

	setTimeout(gameLoop, interval)
}

function addDeadNeighbours() {
	for (const cell of cells.filter((c) => c.alive)) {
		for (const offset of neighboursOffsets) {
			let neighbour = cells.find((c) => c.x == cell.x + offset.x && c.y == cell.y + offset.y)
			if (!neighbour) {
				let newCell = new Cell(cell.x + offset.x, cell.y + offset.y, false)
				cells.push(newCell)
			}
		}
	}
}


function handleCellEvent(x : number, y: number) {

	let cell = cells.find( c => c.x == x && c.y == y)
	if (!cell) {
		let newCell = new Cell(x, y, drawing)
		cells.push(newCell)
	} else {
		cell.alive = drawing
	}
}

const MAX_INTERVAL = 5000
const MIN_INTERVAL = 50

function toInterval(perc : number) : number {
	let delta = MAX_INTERVAL - MIN_INTERVAL

	return (1/perc * delta) + MIN_INTERVAL
	
}

window.onload = () => {

	document.getElementById("play").addEventListener("change", (ev) => {
		playing = (ev.target as HTMLInputElement).checked
	})

	document.getElementById("draw").addEventListener("change", (ev) => {
		drawing = (ev.target as HTMLInputElement).checked
	})

	document.getElementById("speed").addEventListener("change", (ev) => {
		let t = Number(((ev.target as HTMLInputElement).value))
		interval = toInterval(t)
		
	})

	document.getElementById("load").onclick = () => {
		let file = (document.getElementById("loadFile") as HTMLInputElement).files[0];
		if (file) {
			var reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (evt) {
				let loadedCells = JSON.parse(evt.target.result as string) as Cell[]
				cells = loadedCells
			}
		}
	}

	document.getElementById("save").onclick = () => {
		var fileContent = JSON.stringify(cells.filter((c) => c.alive))
		var bb = new Blob([fileContent ], { type: 'application/json' });
		var a = document.createElement('a');
		a.download = 'state.json';
		a.href = window.URL.createObjectURL(bb);
		a.click();
		a.remove()
	}

	document.getElementById("random").onclick = () => {
		cells = []
		for (let i = 20; i < 70; i+=1) {
			for (let j = 20; j < 70; j+=1) {
				if (Math.random() < 0.5) {
					cells.push(new Cell(i, j, true))
				}
			}
		}
	}
	
	
	let renderer = new Renderer(cellSize, handleCellEvent);

	start(renderer)
}