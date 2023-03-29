export default class Cell {
    x : number
    y: number
    alive: boolean
    neighbours: Cell[] = []

    constructor(x : number, y : number, alive: boolean) {
        this.x = x
        this.y = y
        this.alive = alive
    }


    public equals(obj: Cell) : boolean { 
        return this.x == obj.x && this.y == obj.y
    } 
}