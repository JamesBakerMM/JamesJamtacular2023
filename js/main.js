"use strict";
const menu = new Menu();
function preload(){
    menu.preload();
    
}

function setup(){
    new Canvas(800,800)
    menu.setup();
    
}
function draw(){
    background(125)
    menu.draw();

}