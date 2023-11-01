"use strict";

const data = new Data();
const menu = new Menu();
const bg = new Background();


var prevTime = 0;

var xOffset = 0;
var yOffset = 0;

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

    data.setOffset(xOffset, yOffset);

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

    if (kb.pressing('arrowUp')) {
        yOffset -= msPassed / 5;
    }
    if (kb.pressing('arrowDown')) {
        yOffset += msPassed / 5;
    }
    if (kb.pressing('arrowLeft')) {
        xOffset -= msPassed / 5;
    }
    if (kb.pressing('arrowRight')) {
        xOffset += msPassed / 5;
    }
    
    data.setOffset(-xOffset, -yOffset);

    //menu.draw();
}