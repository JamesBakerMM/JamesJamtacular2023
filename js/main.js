"use strict";

const data = new Data();
const menu = new Menu();

var prevTime = 0;

function preload(){
    data.preload();
    menu.preload();
}

function setup(){
    prevTime = new Date().getTime();
    data.setup();
    new Canvas(1600, 900);
    menu.setup(data); //pass data so menu can do its bindings
}

function draw(){
    let newTime = new Date().getTime();
	let msPassed = newTime - prevTime;
	prevTime = newTime;

	if (msPassed < 1) {
		msPassed = 1;
	}

    data.update(msPassed);
    background(25)
    //menu.draw();
}