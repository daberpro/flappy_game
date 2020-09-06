class pillar{
    constructor(x,y,w,h,ctx){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ctx= ctx;
    }

    draw(img,py){
        this.ctx.drawImage(img,this.x,this.y,this.w,this.h);
        // this.ctx.strokeStyle = "red";
        // this.ctx.strokeRect(this.x+60,this.y+py,this.w-120,this.h-115);
    }

    move(canvas){
        this.x-=2;

        if(this.x <= -this.w){
            this.x = -this.w;
        }
    }

}

export{pillar}