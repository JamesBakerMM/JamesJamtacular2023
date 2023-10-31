const FAR_BACKGROUND = 1;
const BACKGROUND = 2;
const FOREGROUND = 3;
const FAR_FOREGROUND = 4;
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
        this.addProp( new Prop(0,0,this.visuals.dust,BACKGROUND) ); 
        this.addProp( new Prop(0,0,this.visuals.stars,FAR_BACKGROUND) );
        
    }
    update() {
        for (let prop of this.props) {
            prop.draw();
        }
    }
    getPropsByLayer(layer){        
        let resultArray = [];
        for (let prop of this.props) {
            if (prop.layer === layer) {
                resultArray.push(prop);
            } else if (resultArray.length > 0) {
                return resultArray;
            }
        }
        return resultArray;
    }
    addProp(prop) {
        if(prop instanceof Prop===false){
            throw Error("oi that's not a prop! >:|")
        }
        //search to find the end of the relevant layer in this.props, 
        //insert it there, so we don't have to resort the entire array every addition
        let index = this.findLastIndexOfProp(prop.layer);
        this.props.splice(index, 0, prop);        
    }

    /**
     * Finds the index at which to insert a new prop; 
     * i.e. one more than the last prop of the same or lower layer
     * @param {number} layer    The layer of the prop to insert
     * @returns The index at which to inset the prop
     */
    findLastIndexOfProp(layer) {
        //debugger;
        for (let i = this.props.length - 1; i >= 0; i--) {
            if (this.props[i].layer <= layer) {
                return i + 1;
            }
        }
        return 0;
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