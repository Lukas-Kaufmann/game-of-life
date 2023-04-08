# README

Conway's game of life implemented in typescript and rendered on an html5 canvas.

## Start

When running it for the first time, to ensure all the dependencies are installed, run:

``` npm install ```

Then to start it run:

```npm run start```

The game of life will be available on localhost:8080

## Usage

The simulation can be controlled with the controls in the top right. The state can be manually be changed by pressing the mouse. Moving the mouse while pressed also changes the cells.

State of the simulation can be saved to file and loaded again. Some example patterns have been provided in [samples](./samples/)

The universe can be moved relative to the screen with the arrow keys.


## Features

### Start/Stop

Start and stop the simulation by toggling the switch labeled `Play`

### Draw/Erase

The world can be edited by pressing the mouse and moving over the cells you want to change. Switch between creating live and dead cells by toggling the switch labeled `Draw/Erase`

### Speed Control

The speed of the simulation can be changed using the slider.

### Save state

Save the state using the button `save`. This will produce a json file `state.json`.

### Load state

Load a previously saved state, by selecting the file at `Choose file` then pressing `Load`. This assumes the file is valid.

### Random state

By pressing `random` a 50 by 75 cells area will randomly filled with cells.

### Reset

Pressing `reset` will kill all the cells.

### Moving

Using the arrow keys the current view on the world can be moved.


## [Screenshot](./img/screenshot.png)
#### of grid and controls

