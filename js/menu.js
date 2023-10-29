const MAIN_MENU = 0;
const SIDE_MENU = 1;
const OTHER_SIDE_MENU = 2;

class Menu {
    constructor(x=0,y=0,w=200,h=400) {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.current = MAIN_MENU;
        //prep the properties
        this.btns = {
            control: {
                main: null,
                optOne: null,
                optTwo: null,
            },
            main: [],
            optOne: [],
            optTwo: [],
        };
    }
    preload() {}
    setup() {
        this.makeControlButtons();
        this.makeMainButtons();
        this.makeOptOneButtons();
        this.makeOptTwoButtons();
    }
    makeControlButtons(){
        let offset_x=this.x+10;
        let offset_y=this.y+0;
        this.btns.control.main = this.makeButton(
            offset_x,offset_y,
            "Main ",
            ()=>{this.current=0}
        );
        offset_x+=50;
        this.btns.control.optOne = this.makeButton(
            offset_x,offset_y,
            "Opt 1",
            ()=>{this.current=1}
        );
        offset_x+=50;
        this.btns.control.optOne = this.makeButton(
            offset_x,offset_y,
            "Opt 2",
            ()=>{this.current=2}
        );
    }
    makeMainButtons(){
        //main buttons
        let offset_y=this.y+40;
        this.btns.main.push(
            this.makeButton(
                this.x,offset_y,
                "fart "
            )
        )
        offset_y+=40;
        this.btns.main.push(
            this.makeButton(
                this.x,offset_y,
                "fart2 "
            )
        )
        offset_y+=40;
        this.btns.main.push(
            this.makeButton(
                this.x,offset_y,
                "fart3 "
            )
        )
    }
    makeOptOneButtons(){
        //main buttons
        let offset_y=this.y+40;
        this.btns.optOne.push(
            this.makeButton(
                this.x,offset_y,
                "fart "
            )
        )
        offset_y+=40;
        this.btns.optOne.push(
            this.makeButton(
                this.x,offset_y,
                "fart2 "
            )
        )

    }
    makeOptTwoButtons(){
        //main buttons
        let offset_y=this.y+40;
        this.btns.optTwo.push(
            this.makeButton(
                this.x,offset_y,
                "fart "
            )
        )
        offset_y+=40;
        this.btns.optTwo.push(
            this.makeButton(
                this.x,offset_y,
                "fart2 "
            )
        )
        offset_y+=40;
        this.btns.optTwo.push(
            this.makeButton(
                this.x,offset_y,
                "fart3 "
            )
        )
        offset_y+=40;
        this.btns.optTwo.push(
            this.makeButton(
                this.x,offset_y,
                "fart4 "
            )
        )
        
    }
    makeButton(
        x=0,
        y=0,
        label,
        func=()=>{console.log(`${label}`)}
    ){
        let tempButton=createButton(label);
        tempButton.position(x, y);
        tempButton.mouseClicked(func);
        return tempButton;
    }
    hide(btns){
        for(let btn of btns){
            btn.hide();
        }
    }
    show(btns){
        for(let btn of btns){
            btn.show();
        }
    }
    draw() {
        push();
        noStroke();
        fill(50+77*this.current);
        rect(this.x,this.y,this.w,this.h);
        if (this.current === MAIN_MENU) {
            this.show(this.btns.main);
            this.hide(this.btns.optOne);
            this.hide(this.btns.optTwo);
        } else if (this.current === SIDE_MENU) {
            this.hide(this.btns.main);
            this.show(this.btns.optOne);
            this.hide(this.btns.optTwo);
        } else if (this.current === OTHER_SIDE_MENU) {
            this.hide(this.btns.main);
            this.hide(this.btns.optOne);
            this.show(this.btns.optTwo);
        }

        pop();
    }
}
