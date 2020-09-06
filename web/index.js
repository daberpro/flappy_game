
 var electron = require("electron");
 var remote = electron.remote;

 import {Ai,Bullet, Hp} from "./enemyAi.js";
 import {particle} from "./particle.js";
 import {pillar} from "./pillar.js";
 
 function getBtn(txt){
     return document.getElementById(txt);
 }

 var msbg = new Audio();
 msbg.src = "music/bgms.mp3";
 msbg.loop = true;
 msbg.play();
 
 let playerPlay = true;

 let showparticle = true;

 let btnRestart = document.querySelector(".restart");
 let btnHome = document.querySelector(".home");

 let pause = false;

 let lompat = 0,ketik= 0, autoJump = true; 
 let tet = "";

 let damage = -1;
 let cr = null;

 let score = 0;
 let pY = 100;
 let level = 1;
 let cantJump = false;

 let data = ["1","2","3","4","5","6","7","8","9","0","q","w","e","r","t","y","u","i","o","p","a","s","d","f",
 "g","h","j","i","k","l","z","x","c","v","b","n","m",",",".","/","!","(",")","-","_","=","+","[","]","{","}",";","|",":","/","?"];
 
 let speedY = 1;

class main{

    canvas(){
        return{
            self: document.getElementById("canvas"),
            add: function(){
                this.self.width = innerWidth;
                this.self.height = innerHeight;

                return{
                    w: this.self.width,
                    h: this.self.height,
                    self: this.self,
                    ctx: this.self.getContext("2d"),
                    box: function(x,y,w,h){
                        this.ctx.fillRect(x,y,w,h);
                    },
                    choice: function(x,y,w,h,tx,color,img){
                        let txt = tx;
                        let X = x;
                        var Y = y, W = w, H = h,speedX = 1;
                        let ct = this.ctx;
                        let C = color;
                        let image = img;
                        return{
                            defeat: function(){
                                C = "darkred"
                            },
                            start: function(){

                                if(txt == ""){
                                    ct.fillStyle = C;
                                    ct.fillRect(X,Y,W,H);
                                }else{
                                    ct.fillStyle = "rgba(0,0,0,0.0)";
                                    ct.fillRect(X,Y,W,H);
                                }
                                ct.font = `40px sans-serif`;
                                ct.fillStyle="black";
                                ct.fillText(txt,X+W/3,Y+H-30);
                            },start2: function(){

                                if(txt == ""){
                                    ct.drawImage(document.querySelector("#player"),pX,pY,80,80);
                                }else{
                                    ct.fillStyle = "rgba(255,255,255,0.0)";
                                    ct.fillRect(pX,pY,W,H);
                                }
                                ct.font = `40px sans-serif`;
                                ct.fillStyle="black";
                                ct.fillText(txt,X+W/3,Y+H-30);
                            },
                            movement: function(){
                                X-= speedX;

                                if(X <= -100){
                                    X = -100;
                                }else{
                                    speedX += 0.01;
                                }

                                return{
                                    x: X,
                                    y: Y,
                                    w: W,
                                    h: H,
                                    c: C,
                                    txt: txt
                                }
                            },
                            move: function(){
                                X-= 2.5;

                                if(X <= -100){
                                    X = -100;
                                }

                                return{
                                    x: X,
                                    y: Y,
                                    w: W,
                                    h: H,
                                    c: C,
                                    txt: txt
                                }
                            },
                            gravity: function(){
                                pY+=speedY;

                                if(pY+H >= new main().canvas().self.height-20 && y-H <= 0){
                                    if(level == 2 || level == 3){
                                        gameOver(true);
                                        pY = canvas.self.height-100;
                                    }else{
                                        speedY = -speedY;
                                        pX-= 0.9;
                                    }
                                    showparticle = false;
                                }
                                else{
                                    speedY+=Math.random()*0.99;
                                    pY+= 1;
                                    showparticle = true;
                                }

                                if(cantJump){
                                    gameOver(true);
                                    pY += speedY;
                                    
                                }

                                if(pX <= 0){
                                    pX= 0;
                                    gameOver(true);
                                }

                                //console.log(this.y)
                                window.onkeydown=function(e){
                                   // console.log(pause)
                                    if(e.keyCode == 38 && !cantJump){
                                        damage += -5;
                                        cr = true;

                                        if(autoJump){
                                            if(level == 2 || level==3){
                                                if(cantJump){
                                                    speedY += 0;
                                                }else{
                                                    speedY = -5;
                                                    damage += -15;
                                                }
                                            }else{
                                                speedY = -7;
                                            }
                                            if(cantJump){
                                                speedY += 0;
                                                
                                            }
                                            lompat++;
                                        }
                                    }
                                }

                                window.onkeyup=function(){
                                    cr = false;
                                }

                                return{
                                    x: X,
                                    y: Y,
                                    w: W,
                                    h: H,
                                    c: C
                                }

                            }
                        }
                    },
                    mountain: function(a){
                         let ct = this.ctx;
                         let x = canvas.self.width,y = canvas.self.height;
                         let A = a;
                         return{
                             start: function(){
                                 ct.restore();
                                 ct.beginPath();
                                 ct.fillStyle="gray";
                                 ct.moveTo(x,y);
                                 ct.lineTo(x+A[0],A[1]);
                                 ct.lineTo(x+A[2],A[3]);
                                 ct.lineTo(x+A[4],canvas.self.height);
                                 ct.lineTo(x,y);
                                 ct.fill();
                                 ct.closePath();
                             },
                             move: function(){
                                 x--;

                                 return{
                                     x: x
                                 }
                             },
                             pos:{
                                 A: A
                             }
                         }
                    },
                    circle: function(x,y,r,txt,c,Rand,p,B){
                        let X = x,
                        Y = y,
                        R = r,
                        Text = txt,
                        ct = this.ctx,
                        speedY = 1,
                        speedX = 1;

                        let b = B[0],b2 = B[1],b3 = B[2];

                        let tr = 0.1;
                        let sp = p;

                        let Color = c;
                        let rand = Rand;
                        
                        //console.log(this.y)
                        return{
                            start:function(b){
                                ct.beginPath();
                                ct.fillStyle=Color;
                                ct.arc(X,Y,R,0,Math.PI*2,true);
                                ct.fill();
                                ct.closePath();
                                //console.log(Y)
                                
                                ct.font = `${R}px sans-serif`;
                                ct.fillStyle="black";
                                ct.fillText(Text,X-R/3.5,Y+R/4);

                            },
                            gravity: function(){
                                Y+=speedY;
                                R-= tr;

                                X += rand;

                                if(X+R >= canvas.self.width){
                                     X = canvas.self.width - R;
                                }else if(X-R <= 0){
                                     X = R;
                                }

                                if(Y+R >= new main().canvas().self.height && y-R <= 0){
                                    speedY = -speedY;
                                }else{
                                    speedY+=Math.random()*0.99;
                                    Y+= 0.1;
                                }

                                if(R <= 1){
                                    R = 1;
                                }

                                return {
                                    r: R
                                }
                                //console.log(this.y)
                            },
                            move:function(){
                                X += rand;
                                Y += speedY;

                                if(Y+R >= new main().canvas().self.height && y-R <= 0){
                                    //speedY += 0.1;
                                }else{
                                    speedY+=0.1;
                                    Y+= 1;
                                }

                                return{
                                    x: X,
                                    y: Y
                                }
                            },
                            cloud: function(a){
                                ct.beginPath();
                                ct.fillStyle=Color;
                                ct.arc(X,Y,R+b,0,Math.PI*2,true);
                                ct.arc(X+R,Y,R+b2,0,Math.PI*2,true);
                                ct.arc(X+R*2,Y,R+b3,0,Math.PI*2,true);
                                ct.fill();
                                ct.closePath();

                                X-= sp;

                                return{
                                    x: X
                                }
                                
                            }
                        }
                    }
                }
            }
        }
    }

}

var daber = new main();
var canvas = daber.canvas().add();
let pX = canvas.self.width/2-100;

//console.log(canvas.ctx.drawImage)

function healt(x,y1,xk,y2){

    let ct = canvas.ctx;
    let x1 = x;
    let x2 = xk;
    let gh = 1;

    return{
        start: function(){
            x1-=gh;
            x2+=gh;

            if(x1 <= canvas.self.width/2-50+(-damage) && x1 < canvas.self.width/2){
                x1 = canvas.self.width/2-50+(-damage);
                gh = 0;
                ct.strokeStyle= "skyblue";
            }else{
                ct.strokeStyle= "lightgreen";
            }

            if(x2 >= canvas.self.width/2+50+damage && x2 > canvas.self.width/2){
                x2 = canvas.self.width/2+50+damage;
                gh = 0;

            }

            if(x1 >= canvas.self.width/2){
                autoJump = false;
            }else{
                autoJump = true;
            }

            if(!cr){
                damage = 0;
                gh = 1;

            }

            ct.beginPath();
            ct.restore();
            ct.lineWidth = 5;
            ct.moveTo(x1,y1);
            ct.lineTo(x2,y2);
            ct.stroke();
            ct.closePath();
            
        }
    }
}

function gameOver(bol){

    if(bol){

    cantJump = true;
    canvas.ctx.fillStyle = "rgba(0,0,0,0.50)";
    canvas.ctx.fillRect(0,0,canvas.self.width,canvas.self.height);

    canvas.ctx.fillStyle = "white";
    canvas.ctx.font = "50px arial";
    canvas.ctx.fillText(`Score: ${score}`,canvas.self.width/2-130,canvas.self.height/3);
    
    btnHome.style.display = "block";
    btnRestart.style.display = "block";
    
    }
}

btnRestart.onclick=function(){
    location.reload();
}

var bg = [];

function fillBg(){

    bg.push(canvas.mountain([
        Math.random() * canvas.self.width/4+200,Math.random() * canvas.self.height,
        Math.random() * canvas.self.width/4+500,Math.random() * canvas.self.height,
        Math.random() * canvas.self.width/4+700,Math.random() * canvas.self.height/2
    ]));
}

fillBg();

function showBg(){
    for(let i=0;i<bg.length;i++){
        bg[i].start();
        if(bg[i].move().x <= -(bg[i].pos.A[0]+bg[i].pos.A[2]+bg[i].pos.A[4]-500)){
            fillBg();
            bg.splice(i,1);
        }
    }
}

var poloi =[];
var size = [30,40,50,70],Size1 = [2,3,4,5];
var rand = [-1,1];
var snow = [];
function game(text){
    let x = Math.floor(Math.random() * canvas.self.width);
    let y = -100;
    let gh = rand[Math.floor(Math.random() * rand.length)]
    let Size = size[Math.floor(Math.random() * size.length)];
    let color = `rgb(${Math.floor(Math.random() * 255)},
                                ${Math.floor(Math.random() * 255)},
                                ${Math.floor(Math.random() * 255)}`;
    let jhk = [0,0,0];
    poloi.push(canvas.circle(x,y,Size,text,color,gh,0,jhk));
}

var cloud =[];
var awan = [10,15,20];

function fillCloud(){
    let x = canvas.self.width;
    let y = Math.floor(Math.random() * canvas.self.height);
    let gh = rand[Math.floor(Math.random() * rand.length)];
    let Size = awan[Math.floor(Math.random() * awan.length)];
    let color = `white`;
    let sped = Math.floor(Math.random() * 5);

    if(sped <= 0 || sped <= 1){
        sped = 1.5;
    }
    cloud.push(canvas.circle(x,y,Size,"",color,gh,sped,[
        Math.random() * 20,
        Math.random() * 20,
        Math.random() * 20
    ]));
}

fillCloud();

function showCloud(){
    for(let i=0;i<cloud.length;i++){

        if(cloud[i].cloud().x <= -200 && cloud.length !== 1){
            cloud.splice(i,1);
        }

    }
}

function fillSnow(){
    let x = Math.floor(Math.random() * canvas.self.width);
    let y = -50;
    let gh = rand[Math.floor(Math.random() * rand.length)]
    let Size = Size1[Math.floor(Math.random() * Size1.length)];
    let color = "white";
    let jhk = [0,0,0];
    snow.push(canvas.circle(x,y,Size,"",color,gh,0,jhk));
}

var ch = [];
var player = canvas.choice(pX,-100,70,70,"","black","../image/bird.png");

function fillCh(){
    let x = canvas.self.width;
    let y = Math.floor(Math.random() * canvas.self.height-200);
    if(y <= 100){
        y = 200;
    }
    ch.push(canvas.choice(x,y,70,70,data[Math.floor(Math.random() * data.length)],"rgba(0,0,0,1.0)"));
}

fillCh();

var moun = [];
var mysize = [100,70,50];

function fillMoun(){
    let x = canvas.self.width;
    let y = Math.floor(Math.random() * canvas.self.height/2+200);
    if(y <= 200){
        y = 200;
    }
    moun.push(canvas.choice(x,y,mysize[Math.floor(Math.random() * mysize.length)],10,"","rgba(70,70,70,1.0)"));
}

fillMoun();

function showCh(){
    
    playerHealth.x = pX-10;
    playerHealth.y = pY-10;
    player.start2();
    let gbh = player.gravity();
    for(let i=0;i<ch.length;i++){
        ch[i].start();
        let hj = ch[i].movement();
        canvas.ctx.lineWidth=2;

        if(pX + gbh.w >= hj.x && pY <= hj.y && pY + gbh.h >= hj.y && pX <= hj.x){
            canvas.ctx.strokeStyle = "skyblue";
            //canvas.ctx.strokeRect(pX,pY,gbh.w,gbh.h);
            canvas.ctx.beginPath();
            canvas.ctx.arc(pX+40,pY+35,50,0,Math.PI*2,true);
            canvas.ctx.closePath();
            canvas.ctx.stroke();

            window.onkeypress=function(e){
                game(e.key);
                ketik++;
            
                if(hj.txt == e.key){
                    score++;
                }
            }
            
        }else if(pX + gbh.w >= hj.x && pY >= hj.y && pY + gbh.h <= hj.y && pX <= hj.x){
            canvas.ctx.strokeStyle = "skyblue";
            canvas.ctx.strokeRect(pX,pY,gbh.w,gbh.h);

            window.onkeypress=function(e){
                game(e.key);
                ketik++;
            
                if(hj.txt == e.key){
                    score++;
                }
            }
        }

        if(ch[i].movement().x <= -100){
            ch.splice(i,1);
        }

    }
    return{
        gbh: gbh
    }

}

function showMoun(){
    let wall = showCh();
    if(level == 2 || level == 3){
        for(let i = 0; i < moun.length; i++){
            moun[i].start();
            let mn = moun[i].move();
    
            if(pX + wall.gbh.w >= mn.x&& pY + wall.gbh.h >= mn.y&& pY + wall.gbh.h < mn.y + mn.h&& pX + wall.gbh.w <= mn.x + mn.w){
                pY = mn.y - wall.gbh.h;
                moun[i].defeat();
            }
    
            if(mn.x <= -100 && moun.length !== 1){
                moun.splice(i,1);
            }
        }
    }

    if(score >= 10 && score <= 20){
        level = 2;
    }else if(score >= 20 && score <= 30){
        level = 3;
    }
}


function showSnow(){
    for(let i=0;i<snow.length;i++){
        snow[i].start();

        if(snow[i].move().y >= canvas.self.height && snow.length !== 1){
            snow.splice(i,1);
        }
    }
}

//game();

//console.log(poloi[0])
//poloi[0].start();

function showBall(){
    for(let i = 0; i < poloi.length; i++){
        // poloi[i].gravity();
        poloi[i].start();

        if(poloi[i].gravity().r <= 1 && poloi.length !== 1){
            poloi.splice(i,1);
        }
    }
}

//var test = canvas.choice(200,200,100,100,"a");


var time = 0,time2 = 0,time3 = 0,time4= 0,timeo = 0;
let ct = canvas.ctx;

let h = healt(canvas.self.width/2,canvas.self.height-100,canvas.self.width/2,canvas.self.height-100);

let enemy = []
//let enemy = new Ai(canvas.ctx,"red",canvas.self.width-100,canvas.self.height/2-250);
//let enemy1 = new Ai(canvas.ctx,"red",canvas.self.width-100,canvas.self.height-250);
let enemySpeed = 1;

function addEnemy(){
    enemy.push(new Ai(canvas.ctx,"red",canvas.self.width-100,canvas.self.height/2-250),
    new Ai(canvas.ctx,"red",canvas.self.width-100,canvas.self.height/2-150))
}

addEnemy()

function showEnemy(){
    if(level == 4){
        for(let x in enemy){
            enemy[x].render();
            // enemy[x].move();
            enemy[x].gravity(enemySpeed)
        }
    }else{
        for(let x = 0; x < 1; x++){
            enemy[x].render();
            // enemy[x].move();
            enemy[x].y += enemySpeed;
            if(enemy[x].y >= canvas.self.height/2+250 || enemy[x].y <= canvas.self.height/2-250){
                enemySpeed = -enemySpeed;
            }else{
                enemySpeed+= 0.1;
            }
        }
    }


}

let bullet = [];

function fillBulletForEnemy(){
    if(level === 4){
        for(let i in enemy){
            let x = enemy[i].x;
            let y = enemy[i].y;
            bullet.push(new Bullet(x,y,6,"red",canvas.ctx));
        }
    }
    if(level === 3){
        let x = enemy[0].x;
        let y = enemy[0].y;
        bullet.push(new Bullet(x,y,6,"red",canvas.ctx));
    }
}

fillBulletForEnemy();

let bulletTime = 0;

function showBullet(){

    if(level == 3 || level == 4){

    showEnemy();
    playerHealth.render();

    bulletTime++;

    if(bulletTime >= 50){
        bulletTime = 0;
        fillBulletForEnemy();
    }

    for(let x in bullet){
        bullet[x].render();
        
        bullet[x].move();

        if(bullet[x].x - bullet[x].r <= 0 && bullet.length !== 1){
            bullet.splice(x,1);
        }

        if(bullet[x].x - bullet[x].r <= pX+30 && bullet[x].x + bullet[x].r >= pX-30&& pY+30 >= bullet[x].y - bullet[x].r && pY - 30 <= bullet[x].y+bullet[x].r){
            canvas.ctx.strokeStyle = "darkred";
            canvas.ctx.beginPath();
            canvas.ctx.arc(pX+40,pY+35,50,0,Math.PI*2,true);
            canvas.ctx.closePath();
            canvas.ctx.stroke();

                if(!playerHealth.w <= 0){
                   playerHealth.w-=10;
                }else{
                  gameOver(true);
                }
            }
        }
    }
}

let playerHealth = new Hp(pX,pY,100,6,canvas.ctx);

let Particle = [];
let ParticelTime = 0;
let ParticelSize = [5,7,8,9,10];
let ParticelColor = ["red","green","blue","skyblue"]

function pushParticle(){
    let x = Math.floor(Math.random() * 50 * Math.abs(Math.sin(pY)))+Math.random() * 10;
    let y = Math.floor(Math.random() * 20 * Math.abs(Math.cos(pY)));
    Particle.push(new particle(canvas.ctx,pX + x,pY + y+70/2,ParticelSize[Math.floor(Math.random() * ParticelSize.length)],
    ParticelColor[Math.floor(Math.random() * ParticelColor.length)]));
}

function showParticel(){
    for(let x in Particle){
        Particle[x].draw(showparticle);
        Particle[x].move(canvas);

        if(Particle.length >= 10 && Particle.length != 1){
            Particle.splice(x,1);
        }else{
            if(!Particle[x].size <= 1){
                Particle[x].size -= 0.1;
            }
        }
    }
}

pushParticle();

let Pillar1 = [];
let Pillar2 = [];

function pushPillar1(){

    if(level == 5){
        let x = canvas.w;
        let y = canvas.h/2-200; 
        Pillar1.push(new pillar(x,y,300,450,canvas.ctx));
    }
}

pushPillar1();

function pushPillar2(){
    let x = canvas.w;
    let y = Math.random()* -100; 
    Pillar2.push(new pillar(x,y,300,450,canvas.ctx));
}

pushPillar2();

let Pillar1Image = new Image();
Pillar1Image.src = "../image/pillar bawah.png";

let Pillar2Image = new Image();
Pillar2Image.src = "../image/pillar atas.png";

let pillarTime = 0;

function showPillar(){

    if(level === 5){
        for(let x in Pillar1){
            playerHealth.render();
            Pillar1[x].draw(Pillar1Image,110);
            Pillar2[x].draw(Pillar2Image,0);
            Pillar1[x].move(canvas);
            Pillar2[x].move(canvas);
            Pillar1[x].y = Pillar2[x].y + Pillar2[x].h - 50; 
            if(Pillar1[x].x <= -Pillar1[x].w){
                Pillar1.splice(x,1);
                Pillar2.splice(x,1);
            }
            if((pX+50 >= Pillar2[x].x && pY <= Pillar2[x].y+Pillar2[x].h-115)&&
            (pX <= Pillar2[x].x + Pillar2[x].w-120) && playerPlay){
                canvas.ctx.strokeStyle = "red";
                canvas.ctx.beginPath();
                canvas.ctx.arc(pX+40,pY+35,50,0,Math.PI*2,true);
                canvas.ctx.closePath();
                canvas.ctx.stroke();
                pY = Pillar2[x].y + Pillar2[x].h-115;
                if(!playerHealth.w <= 0){
                    playerHealth.w-=10;
                 }else{
                   gameOver(true);
                   playerPlay = false;
                 }
            }
            if((pX+50 >= Pillar1[x].x && pY+50 >= Pillar1[x].y+80)&&
            (pX <= Pillar1[x].x + Pillar1[x].w-120) && playerPlay){
                canvas.ctx.strokeStyle = "red";
                pY = Pillar1[x].y+10;
                canvas.ctx.beginPath();
                canvas.ctx.arc(pX+40,pY+35,50,0,Math.PI*2,true);
                canvas.ctx.closePath();
                canvas.ctx.stroke();
                speedY = -speedY;
                if(!playerHealth.w <= 0){
                    playerHealth.w-=10;
                 }else{
                   gameOver(true);
                   playerPlay = false;
                 }
            }
        }
    }
}

function loop(){
    if(pause){
        cancelAnimationFrame(loop)
    }else{
        requestAnimationFrame(loop);
    }
    canvas.ctx.clearRect(0,0,canvas.self.width,canvas.self.height);

    // test.start();
    // test.movement();

    ParticelTime++;

    if(ParticelTime >= 2){
        pushParticle();
        ParticelTime = 0;
    }

    showCloud();
    showBg();
    showBall();

    if(level == 2 || level == 3){
        if(timeo >= 50){
            fillMoun();
            timeo = 0;
        }
    }else if(timeo >= 50){
        timeo = 0;
    }

    //cloud[0].cloud();

    pillarTime++;

    if(pillarTime >= 200){
        pillarTime = 0;
        pushPillar1();
        pushPillar2();
    }


    showParticel();

    showMoun();

    showPillar();
    showBullet();

    canvas.ctx.fillStyle="silver";
    canvas.box(0,canvas.self.height-20,canvas.self.width,200);

    canvas.ctx.font = "50px arial";
    canvas.ctx.fillText("Daber",canvas.self.width/2-100,100,200,50);

    canvas.ctx.font = "20px arial";
    canvas.ctx.fillText(`Lompat: ${lompat}`,50,canvas.self.height/2-100,200,50);
    canvas.ctx.font = "20px arial";
    canvas.ctx.fillText(`Ketik    : ${ketik}`,50,canvas.self.height/2-70,200,50);
    canvas.ctx.font = "20px arial";
    canvas.ctx.fillText(`Score    : ${score}`,50,100,200,50);
    canvas.ctx.font = "20px arial";
    canvas.ctx.fillText(`Level     : ${level}`,50,130,200,50);
    
    
    timeo++;
    showSnow();
    h.start();

    time++;
    if(time >=2000){
        time = 0;
    }else if(time >= 1990){
        game("");
    }

    time4++;

    if(time4 >= 200){
        fillCloud();
        time4 = 0;
    }

    time3++;

    if(time3 >= 100){
        fillCh();
        time3=0; 
    }

    time2++;

    if(time2 >= 5){
        fillSnow();
        time2 = 0;
    }

    return function(){};

}

let mainfn = null;

document.body.onload=function(e){
   // console.log(e)
    mainfn = loop();
}

btnRestart.style.marginLeft = canvas.self.width/2-115+"px";
btnHome.style.marginLeft = canvas.self.width/2+"px";

window.onresize=function(){
        daber.canvas().add();
        btnRestart.style.marginLeft = canvas.self.width/2-115+"px";
        btnHome.style.marginLeft = canvas.self.width/2+"px";

}

let Win = remote.getCurrentWindow();


getBtn("close").onclick=function(){
   Win.close(); 
}

getBtn("maximize").onclick=function(){
    Win.maximize();
    btnRestart.style.marginLeft = canvas.self.width/2-115+"px";
    btnHome.style.marginLeft = canvas.self.width/2+"px";

}

getBtn("minimize").onclick=function(){
    Win.minimize();
    msbg.muted = true;
    pause = true;
    mainfn = null;
}

window.document.body.querySelector("canvas").onclick=function(){
    msbg.muted = false;
    pause = false;

    if(typeof mainfn == "function"){
         //mainfn = null;
    }else{
        mainfn = loop();
    }
}

window.document.body.onkeydown=function(e){
    if(e.keyCode == 27){
        msbg.muted = true;
        pause = true;
        mainfn = null; 
    }
}
