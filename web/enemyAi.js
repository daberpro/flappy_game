

class Ai {
    constructor(context, c, x, y) {
        this.x = x;
        this.y = y;
        this.r = 40;
        this.img = null;
        this.color = c;
        this.ctx = context;
        this.canvas = canvas;
        this.gravitySpeed = 1;

        this.render = function () {
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        };

        this.move = function () {
            this.y = this.canvas.height / 2 - this.r / 2;
            this.x = this.canvas.width - 100;
        };

        this.gravity = function(object){
            this.y += this.gravitySpeed;

            if(this.y >= canvas.height/2+250 || this.y <= canvas.height/2-250){
                this.gravitySpeed = -this.gravitySpeed;
            }else{
                this.gravitySpeed+= 0.1;
            }
        }
    }
}

class Bullet{
    constructor(x,y,r,c,context){
        this.x = x;
        this.y = y;
        this.r = r;
        this.img = null;
        this.color = c;
        this.ctx = context;
        let speedX = 1;

        this.render = function () {
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        };

        this.move = function(){
            this.x -= speedX;

            if(this.x - this.r <= 0){
                this.x = this.r;
            }else{
                this.x -= 0.1;
                speedX += Math.random() * 0.99;
            }
        }
    }
}

class Hp{
    constructor(x,y,w,h,context){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.ctx = context;

        this.render=function(){
            this.ctx.fillStyle = "lightgreen";
            this.ctx.fillRect(this.x, this.y , this.w, this.h);
        }
    }
}

export {Ai,Bullet,Hp}