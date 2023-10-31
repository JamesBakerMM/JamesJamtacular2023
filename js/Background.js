const FAR_BACKGROUND = -1;
const BACKGROUND = 0;
const FOREGROUND = 1;
const FAR_FOREGROUND = 2;
/*
 * manages the non sprite background elements
 */
class Background {
    constructor() {
        this.visuals = {};
        this.props = [];
    }
    preload() {
        this.visuals.stars = loadImage("./assets/img/bg_stars.png");
        this.visuals.dust = loadImage("./assets/img/bg_dust.png");
    }
    setup() {
        this.addProp( new Prop(0,0,this.visuals.stars,FAR_BACKGROUND) );
        this.addProp( new Prop(0,0,this.visuals.dust,BACKGROUND) ); 
        this.sortByLayer();
    }
    update() {
        for (let prop of this.props) {
            prop.draw();
        }
    }
    getPropsByLayer(layer){
        //search through the array, match to .layer return new array with refs just those props
    }
    sortByLayer() {
        //algo that sorts by .layer
    }
    addProp(prop) {
        if(prop instanceof Prop===false){
            throw Error("oi that's not a prop! >:|")
        }
        //search to find the end of the relevant layer in this.props, insert it there, so we don't have to resort the entire array every addition
        this.props.push(prop); //temp
    }
}

/*
 * class that holds a representaiton of a bg prop on the screen
 * will support an image or animation being attached for image
 */
class Prop {
    constructor(x=0, y=0, img, layer=FAR_BACKGROUND) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.layer = layer;
    }
    draw() {
        const isAnimation=(this.img.length!==undefined);
        if(isAnimation){
            animation(this.img,this.x,this.y);
        } else {
            image(this.img, this.x, this.y);
        }
    }
}
