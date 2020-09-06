class particle{
    constructor(ctx,x,y,size,color){
        this.gravity = 1;
        this.velocity = 1;
        this.size = size;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.color = color;
    }

    draw(bol){
        if(bol){
            this.ctx.fillStyle = this.color; 
            this.ctx.fillRect(this.x,this.y,this.size,this.size);
        }
    }

    move(canvas){

        this.y += this.gravity;
        this.x -= this.velocity;
        
        if(this.y+this.size >= canvas.height){
            this.y = canvas.height - this.size;
        }else{
            this.gravity+= 0.1;
            this.velocity+= 0.5;
        }

    }
}

export {particle}