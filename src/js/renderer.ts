import Cell from "./cell";

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private height: number = window.innerHeight;
	private width: number = window.innerWidth;
	private cellSize: number
	private eventOnCell : (x: number, y: number) => void

	private offsetX = 0
	private offsetY = 0

	private moveStep = 50


	private mousedown : boolean


	constructor(cellSize: number, eventOnCell : (x: number, y: number) => void ) {
		this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext("2d");
		this.cellSize = cellSize
		this.eventOnCell = eventOnCell
		this.mousedown = false
		let rect = this.canvas.getBoundingClientRect()
		let left = rect.left
		let top = rect.top

		const sendEvent = (ev: MouseEvent) => {
			
			const x = ev.clientX - left
			const y = ev.clientY - top
			eventOnCell(Math.floor(x / cellSize), Math.floor(y / cellSize))
		}

		this.canvas.onmousedown = (ev) => {
			this.mousedown = true
			sendEvent(ev)
		}

		this.canvas.onmouseup = () => {
			this.mousedown = false
		}

		this.canvas.onmousemove = (ev) => {
			if (this.mousedown) {
				sendEvent(ev)
			}
		}


		document.addEventListener("keydown", (ev) => {
			if (ev.key == "ArrowDown") {
				this.offsetY += this.moveStep
			}
			if (ev.key == "ArrowUp") {
				this.offsetY -= this.moveStep
			}
			if (ev.key == "ArrowLeft") {
				this.offsetX -= this.moveStep
			}
			if (ev.key == "ArrowRight") {
				this.offsetX += this.moveStep
			}
		})
		
	}
	//TODO draggedOffset, if we allow to move the screen

	public render(cells: Array<Cell>): void {

		this.ctx.fillStyle = "grey"
		this.ctx.fillRect(0, 0, this.width, this.height)
		this.ctx.fill()

		//draw grid
		const gridshiftX = this.offsetX % this.cellSize
		const gridshiftY = this.offsetY % this.cellSize

		this.ctx.strokeStyle = "light grey"

		//horizonatal
		for (let y = gridshiftX; y < this.height; y+=this.cellSize) {
			this.ctx.beginPath()
			this.ctx.moveTo(0, y)
			this.ctx.lineTo(this.width, y)
			this.ctx.stroke()
		}

		//vertical
		for (let x = gridshiftY; x < this.width; x+=this.cellSize) {
			this.ctx.beginPath()
			this.ctx.moveTo(x, 0)
			this.ctx.lineTo(x, this.height)
			this.ctx.stroke()
		}
	



		this.ctx.fillStyle = "white"
		for (const cell of cells) {
			if (cell.alive) {
				this.ctx.fillRect((cell.x * this.cellSize) + 1 + this.offsetX, (cell.y * this.cellSize) + 1 + this.offsetY, this.cellSize - 2, this.cellSize - 2)
				this.ctx.fill()
			}
		}
		
	}
}