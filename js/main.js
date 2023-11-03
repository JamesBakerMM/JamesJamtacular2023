"use strict";

const SCREEN_WIDTH = 1600;
const SCREEN_HEIGHT = 900;

const data = new Data();
const menu = new Menu();

var prevTime = 0;

var xOffset = 0;
var yOffset = 0;

function preload(){
    data.preload();
    menu.preload();
}

function setup(){
    prevTime = new Date().getTime();
    data.setup();
    new Canvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    menu.setup(data); //pass data so menu can do its bindings
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
    menu.draw(data);
    data.update(msPassed);
    cameraGood.update(msPassed);

    data.setOffset(-cameraGood.getX(), -cameraGood.getY());

    //menu.draw();
}