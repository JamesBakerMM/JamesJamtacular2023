const MIN_RANGE=300;
const MED_RANGE=500;
const LONG_RANGE=700;
const RESOURCE_LAYER = 1;
const ENEMY_LAYER = 2;
const PC_LAYER = 3;

class ObjectFactory {
    constructor() {
        this.images = new Array();
        this.anims = new Array();
    }

    preload() {
        this.images.push({id: "refinery",       path: "assets/img/refinery.png"});
        this.images.push({id: "drone",          path: "assets/img/drone_smallest.png"});
        this.images.push({id: "laser",          path: "assets/img/laser.png"});
        this.images.push({id: "torpedo",        path: "assets/img/torpedo.png"});
        this.images.push({id: "gun",            path: "assets/img/destroyer.png"});
        this.images.push({id: "bullet",         path: "assets/img/bullet.png"});
        this.images.push({id: "enemy refinery", path: "assets/img/hostileRefinery.png"});
        this.images.push({id: "enemy drone",    path: "assets/img/hostileDrone.png"});
        this.images.push({id: "enemy laser",    path: "assets/img/hostileLaser.png"});
        this.images.push({id: "enemy torpedo",  path: "assets/img/hostileTorpedo.png"});

        this.anims.push({id: "rock", path: [
            "assets/img/rock_asteroid1.png",
            "assets/img/rock_asteroid2.png",
            "assets/img/rock_asteroid3.png",
            "assets/img/rock_asteroid4.png"
        ]})
        this.anims.push({id: "dirtyExplosion", path: [
            "assets/img/explosion-at1.png",
            "assets/img/explosion-at2.png",
            "assets/img/explosion-at3.png",
            "assets/img/explosion-at4.png",
            "assets/img/explosion-at5.png",
            "assets/img/explosion-at6.png",
            "assets/img/explosion-at7.png",
            "assets/img/explosion-at8.png"
        ]})
        this.anims.push({id: "cleanExplosion", path: [
            "assets/img/explosion-e1.png",
            "assets/img/explosion-e2.png",
            "assets/img/explosion-e3.png",
            "assets/img/explosion-e4.png",
            "assets/img/explosion-e5.png",
            "assets/img/explosion-e6.png",
            "assets/img/explosion-e7.png",
            "assets/img/explosion-e8.png",
            "assets/img/explosion-e9.png",
            "assets/img/explosion-e10.png",
        ]})        
        this.anims.push({id: "smallWreckage", path: [
            "assets/img/wreckage1.png",
            "assets/img/wreckage2.png",
            "assets/img/wreckage3.png",
            "assets/img/wreckage4.png",
            "assets/img/wreckage5.png",
            "assets/img/wreckage6.png",
            "assets/img/wreckage7.png",
            "assets/img/wreckage8.png",
            "assets/img/wreckage9.png"
        ]})
        this.images.push({id: "missile", path: 
            "assets/img/missile1.png",
        })
        this.images.push({id: "enemyMissile", path: 
            "assets/img/enemy_missile1.png",
        })


        for(let img of this.images) {
            img.image = loadImage(img.path);
        }
        for(let ani of this.anims) {
            ani.image = loadAnimation(ani.path);
        }
    }

    /**
     * searches through given array for the asset we want
     * @param {int} id 
     * @param {array} images 
     * @returns img or animation or null
     */
    getByID(id,images) {
        for(let img of images) {
            if (img.id === id) {
                return img.image;
            }
        }
        return null;
    }

    createObject(x, y) {
        let obj = new Sprite(x, y);
        // obj.debug = true;
        return obj;
    }

    createComet(x, y, amount=20) {
        let obj = this.createResource(x, y, amount);
        obj.minVel.x = random(1, 10);
        obj.minVel.y = random(-10, 1);
    }

    createResource(x, y, amount=4) {
        let obj = this.createObject(x, y);
        obj.type = "metal"
        obj.addAni("rock",this.getByID("rock",this.anims));
        obj.ani.stop();
        obj.scale = amount/2;
        obj.startingMetal = obj.metal = amount; // Do I need to declare startingMetal first?
        obj.textSize=34;
        // obj.mass = amount;
        obj.rotationSpeed = (Math.random() * 0.5) - 0.25;
        obj.diameter = obj.width;
        obj.drag = 0.5;
        obj.layer = RESOURCE_LAYER;
        return obj;
    }

    createRefinery(x, y) {
        let obj = this.createShip(x, y, "refinery");
        obj.image = this.getByID("refinery",this.images);
        let centreDiameter = obj.image.height/2;
        obj.w=obj.img.w/1.25;
        // obj.
        obj.addCollider(18,0,obj.img.h)
        // obj.diameter = centreDiameter;
        // let miniHeight = obj.height/2;
        // obj.addCollider(miniHeight, 0, obj.image.height);
        // obj.addCollider(-2*miniHeight, 0, obj.image.height);
        //obj.addCollider(-obj.height/2, 0, obj.image.height);
        obj.hp.setHealth(20);
        obj.faction = 0;
        //obj.vel.x = 0.2;
        obj.range=LONG_RANGE;
        obj.speedFactor = 2;
        obj.drag = 30;
        return obj;
        obj.debug = true;
    }

    createShip(x, y, type) {
        let obj = this.createObject(x, y);
        obj.originalPosition = {x: x, y: y};
        obj.targetPos = obj.originalPosition;
        obj.type = type;
        obj.hp = new Health(1);
        obj.speedFactor = 1;
        obj.layer = PC_LAYER;
        return obj;
    }

    createDrone(x, y, refinery) {
        let obj = this.createShip(x, y, "drone");
        obj.image = this.getByID("drone",this.images);
        obj.diameter = obj.width;
        obj.faction = 0;
        obj.targetResource = null;
        obj.moveTimer = 0;
        obj.metal=0;
        obj.hp.setHealth(10);
        obj.speedFactor = 2.1;
        obj.refinery = refinery;
        return obj;
    }

    createEnemyDrone(x, y, faction, refinery) {
        let obj = this.createShip(x, y, "enemy drone");
        obj.image = this.getByID("enemy drone", this.images);
        obj.faction = faction;
        obj.diameter = obj.width;
        obj.targetResource = null;
        obj.moveTimer = 0;
        obj.metal = 0;
        //obj.range = 
        //obj.scale = 
        obj.hp.setHealth(10);
        obj.speedFactor = 2.1;
        obj.refinery = refinery;
        obj.layer = ENEMY_LAYER;
        return obj;
    }

    createLaser(x,y){
        let obj = this.createShip(x, y, "laser");
        obj.image = this.getByID("laser",this.images);
        obj.faction = 0;
        // obj.scale = 1.5;
        obj.selected = false;
        obj.hp.setHealth(20);
        obj.shooting = new Shooting(100, MIN_RANGE);
        return obj
    }

    createTorpedo(x,y, faction){
        let obj = this.createShip(x, y, "torpedo");
        let image = "torpedo";
        if (faction > 0) {
            image = "enemy torpedo";
        }
        obj.image = this.getByID(image,this.images);
        obj.diameter=obj.image.h-10;
        obj.faction = faction;
        obj.scale = 2;
        obj.selected = false;
        obj.hp.setHealth(20);
        obj.shooting = new Shooting(3000, LONG_RANGE);
        return obj
    }

    createGun(x,y){
        let obj = this.createShip(x, y, "gun");
        obj.image = this.getByID("gun",this.images);
        obj.faction = 0;
        // obj.scale = 2;
        obj.selected = false;
        obj.range=MED_RANGE;
        obj.hp.setHealth(20);
        return obj
    }

    createEnemyRefinery(x, y, faction) {
        let obj = this.createShip(x, y, "enemy refinery");
        obj.image = this.getByID("enemy refinery",this.images);
        obj.faction = faction;
        obj.hp.setHealth(20);
        obj.range=LONG_RANGE;
        obj.speedFactor = 2;
        obj.drag = 30;
        obj.debug = true;
        obj.layer = ENEMY_LAYER;
        return obj;
    }


    createBullet(origin, target) {

        let ox = origin.x;
        let oy = origin.y;

        let vx = target.x-ox;
        let vy = target.y-oy;

        length = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));

        // normalize vector
        vx = vx / length;
        vy = vy / length;

        //apply bullet speed
        vx = vx * 10;
        vy = vy * 10;

        let obj = this.createObject(ox, oy, "bullet");
        obj.image = this.getByID("bullet",this.images);
        obj.faction = origin.faction;
        obj.damage = 1;
        obj.vel.x = vx;
        obj.vel.y = vy;
        // obj.lifetime = 2000;
        obj.life=300;
        obj.damage=1;
        return obj;
    }

    createMissile(origin, target, offset) {

        let deg = origin.rotation - 90;
        
        let offsetX = cos(deg) * offset;
        let offsetY = sin(deg) * offset;

        let obj = this.createObject(origin.x + offsetX, origin.y+offsetY, "missile");
        if (offset > 0) {
            obj.rotation = origin.rotation - 90;
        } else {
            obj.rotation = origin.rotation + 90;
        }
        obj.faction = origin.faction;
        if(obj.faction!==0){
            obj.image = this.getByID("enemyMissile",this.images);
        } else {
            obj.image = this.getByID("missile",this.images);
        }
        obj.damage = 1;
        obj.target = target;
        obj.life=300;
        // obj.lifetime = 10000;
        obj.tracking = 0.02;
        obj.trackingChange = 0.005;
        return obj;
    }

    createDirtyExplosion(x,y,scale){
        let obj = this.createObject(x,y);
        obj.img = this.getByID("dirtyExplosion",this.anims);
        obj.collider="none";
        obj.scale=scale;
        obj.life = obj._ani.length*obj._ani.frameDelay-1;
        return obj
    }
    createCleanExplosion(x,y){
        let obj = this.createObject(x,y);
        obj.img = this.getByID("cleanExplosion",this.anims);
        obj.collider="none";
        obj.scale=scale;
        obj.life = obj._ani.length*obj._ani.frameDelay-1;
        return obj
    }

    createWreckage(x,y,amount=9,scale=1) {
        let obj=this.createObject(x,y);
        obj.type = "wreckage";
        obj.img = this.getByID("smallWreckage",this.anims);
        obj.ani.stop();
        
        obj.diameter = obj.width;
        obj.scale = 2;
        obj.textSize=34;
        obj.rotationSpeed = (Math.random() * 0.5) - 0.25;

        obj.startingMetal = obj.metal = amount; 
        obj.layer = RESOURCE_LAYER;
        obj.drag = 0.5;
        return obj
    }
}
