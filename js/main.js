"use strict";

const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 900;

const data = new Data();
const gui = new GUI();
const menu = new Menu(gui.minimap.width-3);
gui.menu=menu;

var prevTime = 0;

var xOffset = 0;
var yOffset = 0;

function preload(){
    data.preload();
    menu.preload();
    gui.preload();
}

function setup(){
    prevTime = new Date().getTime();
    data.setup();
    new Canvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    menu.setup(data); //pass data so menu can do its bindings
    gui.setup()
}

function draw(){    

    data.setOffset(cameraGood.getX(), cameraGood.getY());

    background(25)

    let newTime = new Date().getTime();
	let msPassed = newTime - prevTime;
	prevTime = newTime;

	if (msPassed < 1) {
		msPassed = 1;
	}

    
    data.updateBackground(msPassed);
    gui.updatePre(data);

    cameraGood.update(msPassed);
    data.update(msPassed);

    gui.updatePost(data);
    data.setOffset(-cameraGood.getX(), -cameraGood.getY());

    //menu.draw();
}


function superDraw() {
    gui.superDraw(data);

    menu.update(data);
}