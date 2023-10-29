"use strict";

let objectsToDraw = new Array();

const menu = new Menu();
const factory = new ObjectFactory();
function preload(){
    menu.preload();
    factory.preload();
}

function setup(){
    new Canvas(1600, 900);
    //menu.setup();

    for (let i = 0; i < 20; i++) {
        let x = Math.random() * 1600;
        let y = Math.random() * 900;
        objectsToDraw.push(factory.createResource(x, y, 100));
    }
    
}

function draw(){
    background(125)
    //menu.draw();
}