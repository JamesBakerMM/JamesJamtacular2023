class ObjectFactory {
    constructor() {
        this.images = new Array();
    }

    preload() {
        this.images.push({name: "crystal", path: "assets/img/crystal.png"})
        for(let img of this.images) {
            img.image = loadImage(img.path);
        }
    }

    getImageByName(name) {
        for(let img of this.images) {
            if (img.name === name) {
                return img.image;
            }
        }
        return null;
    }

    createObject(x, y) {
        let newObject = new Sprite(x, y);
        newObject.debug = true;
        return newObject;
    }

    createResource(x, y, amount) {
        let newObject = this.createObject(x, y);
        newObject.image = this.getImageByName("crystal");
        return newObject;
    }
}