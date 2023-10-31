"use strict";

const data = new Data();
const menu = new Menu();
const bg = new Background();


var prevTime = 0;


function preload(){
    bg.preload();
    data.preload();
    menu.preload();
}

function setup(){
    prevTime = new Date().getTime();
    bg.setup();
    data.setup();
    new Canvas(1600, 900);
    menu.setup(data); //pass data so menu can do its bindings
}

function draw(){    
    background(25)
    bg.update();
    let newTime = new Date().getTime();
	let msPassed = newTime - prevTime;
	prevTime = newTime;

	if (msPassed < 1) {
		msPassed = 1;
	}
    menu.draw(data);
    data.update(msPassed);

    //menu.draw();
}