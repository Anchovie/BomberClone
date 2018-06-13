var cols = 14;
var rows = 14;
var tileSize = 60;
var tileSizeVec;
var upgradeSizeVec;
var num_powerups = 8;

var matrix = [];

var blocks = [];
var prevBlocks = [];
var bombs = [];

var x,y;
var xdir,ydir;
var dir;

var LEFT = 1;
var RIGHT = 2;
var UP = 3;
var DOWN = 4;


//block ids
var METAL = 1;
var TILE = 2;
var WOOD = 3;
var BOMB = 10;

var FIREPLUS = 51;
var FIREBREAK = 52;
var HEALTHPLUS = 53;
var BUILDER = 54;
var SPEEDPLUS = 55;
var BOMBPLUS = 56;
var LIFEPLUS = 57;
var QUESTION = 58;

var img;
function preload() {
  sprites = loadImage('assets/spritesheet2.png');
  status_bar = loadImage('assets/statusbar.png');
}

var spriteFloor;

var map1 = [
[0,0,0,2,2,2,0,2,0,2,2,2,0,1],
[0,1,0,1,2,1,2,1,0,1,2,1,0,1],
[0,2,0,2,0,2,0,2,0,2,0,1,0,1],
[2,1,0,1,2,1,2,1,2,1,2,1,0,1],
[0,0,0,2,2,2,0,2,0,2,0,1,0,1],
[2,1,0,1,0,1,2,1,2,1,2,1,0,1],
[2,0,2,2,2,2,0,2,2,2,0,1,0,1],
[0,1,0,1,2,1,2,1,0,1,2,1,0,1],
[2,2,0,2,2,2,0,2,0,2,0,1,0,1],
[0,1,2,1,0,1,2,1,0,1,2,1,0,1],
[0,0,0,2,2,2,2,2,0,2,0,1,0,1],
[0,1,2,1,0,1,2,1,0,1,2,1,0,1],
[0,0,0,2,2,2,2,2,0,2,0,1,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,0,1]
];


function setup() {
    createCanvas(960, 840);
    console.log(map1);
    console.log(map1[1][1]);
    tileSizeVec = createVector(60,60);
    upgradeSizeVec = createVector(30,30);
    spriteFloor = new Sprite(sprites, createVector(300,0), tileSizeVec, 0.3, [0], 'vertical', this, false );
    spriteFloor.update(1);
    for(var y=0; y<rows; y++){
        matrix[y] = [];
        for(var x=0; x<cols; x++){
            console.log(map1[y][x]+ " = " + y+","+x);
            //if ((y>2 && y<rows-2) || (x>2 && x<cols-2)){
                // matrix[y][x] = round(random(1));
                // if (matrix[y][x] ===1) {
                //     matrix[y][x] = new Block(x*tileSize,y*tileSize, tileSize, TILE);

                // }
                if (map1[y][x] !== 0){
                    matrix[y][x] = new Block(x*tileSize,y*tileSize, tileSize, map1[y][x]);
                } else {
                    matrix[y][x] = 0;
                }
        }
    }
    player = new Player(30, 30);
    xdir=0;
    ydir=0;
    console.log(matrix);
    console.log(blocks);
    frameRate(30);
    rectMode(CORNER);
    ellipseMode(CENTER);
    //noLoop();
}

function draw(){
    
    background(50);
    drawWorld();
    updateWorld();
    
    
    for (var y=0; y< cols; y++){
        for (var x=0; x<rows; x++){
            //if (matrix[y][x] !== 0){
            if (isNaN(matrix[y][x])){
                matrix[y][x].draw();
            }
        }
    }

    for (var i=0; i<bombs.length; i++){
        bombs[i].draw();
    }
    player.move(dir)
    player.draw();
    player.drawStats();
    
    
}

function updateWorld(){ //move all block creation here, add numbers to matrix elsewhere?
    for (var i=bombs.length-1; i>=0; i--){
        if (bombs[i].exploded && bombs[i].spriteExp.done){
            bombs[i] = null;
            bombs.splice(i,1);  
            console.log("removed " + i + "left :" + bombs.length);
            console.log(bombs);
            if (bombs.length === 0) bombs = [];
        }
    }
}

function drawWorld(){
    stroke(255,255,255);
    //for (var i=1; i<cols; i++){
        //line(i*tileSize,0,i*tileSize,height);
        //line(0,i*tileSize,width,i*tileSize);
    //}
    for (var y = 0; y<rows; y++){
        for (var x = 0; x<cols; x++){
            if (this.matrix[y][x]===0);
            spriteFloor.render(x*tileSize,y*tileSize);
        }
    }
    image(status_bar,840, 0);
}

function Player(x, y){
    this.x = x;
    this.y = y;
    this.xind = floor(this.x/tileSize);
    this.yind = floor(this.y/tileSize);
    this.r = 35;
    this.vel = createVector(6,6);
    this.dir = DOWN;
    this.moving = false;

    this.lives = 2;
    this.hpMax = 4;
    this.hp = this.hpMax;
    this.max_bombs = 3;
    this.bomb_reach = 2;

    this.spriteUp = new Sprite(sprites, createVector(0,300), tileSizeVec, 0.3, [0,1,0,2], 'vertical', this, false );
    this.spriteRight = new Sprite(sprites, createVector(60,300), tileSizeVec, 0.3, [0,1,0,2], 'vertical', this, false );
    this.spriteLeft = new Sprite(sprites, createVector(120,300), tileSizeVec, 0.3, [0,1,0,2], 'vertical', this, false );
    this.spriteDown = new Sprite(sprites, createVector(180,300), tileSizeVec, 0.3, [0,1,0,2], 'vertical', this, false );

    this.draw = function(){
        //stroke(0,0,255);
        //fill(0,0,255);
        //ellipse(this.x,this.y, 3, 3);
        if (this.moving){
            this.spriteLeft.update(1);
            this.spriteRight.update(1);
            this.spriteUp.update(1);
            this.spriteDown.update(1);
        }
        switch(this.dir){
            case LEFT:
                this.spriteLeft.render(this.x-12, this.y-28);
                break;
            case RIGHT:
                this.spriteRight.render(this.x-12, this.y-28);
                break;
            case UP:
                this.spriteUp.render(this.x-12, this.y-28);
                break;
            case DOWN:
                this.spriteDown.render(this.x-12, this.y-28);
                break;
            default:
                stroke(255,0,0);
                fill(220,30,30);
                rect(this.x, this.y, this.r, this.r);
                break;
        }
    }

    this.drawStats = function(){
        textSize(20);
        fill(0);
        stroke(0);
        text("Fire: " + this.bomb_reach, 840+20, 150);
        text((this.max_bombs-bombs.length) +"/"+this.max_bombs, 840+70, 128);
        text("X " + this.lives, 840+70,50);
        strokeWeight(1);
        fill(30,160,30);
        for (var i=0; i<this.hp; i++){
            rect(840+23+i*(73/(this.hpMax)),76,73/(this.hpMax), 9); // 96 85
        }

    }

    this.move = function(dir){
        if (!dir) return;
        if (this.x<0) this.x=2;
        if (this.x>width-this.r) this.x = width-this.r-2;
        if (this.y<0+30) this.y=30;
        if (this.y>height-this.r) this.y = height-this.r-30;
        var prevX = this.x;
        var prevY = this.y;
        
        this.x += (dir.x*this.vel.x);
        this.y += (dir.y*this.vel.y);
        this.xind = floor(this.x/tileSize);
        this.yind = floor(this.y/tileSize);

        var collision = this.collide(matrix[this.yind][this.xind]);
        var xstart = max(this.xind-1,0);
        if (xstart < 0) xstart=0;
        var ystart = max(this.yind-1,0);
        if (ystart < 0 ) ystart=0;
        var xend = min(this.xind+1,cols-1);
        if (xend > cols) xend = cols-1;
        var yend = min(this.yind+1,rows-1);
        if (yend > rows) yend = rows-1;
        for (var y = ystart; y<=yend; y++){
            for (var x = xstart; x<=xend; x++){
                collision = collision || this.collide(matrix[y][x]);
                if (collision && matrix[y][x] instanceof Upgrade){
                    player.getUpgrade(matrix[y][x].type);
                    matrix[y][x] = 0;
                }
            }
        }
        
        
        if (collision){
            this.x = prevX;
            this.y = prevY;
            this.xind = floor(this.x/tileSize);
            this.yind = floor(this.y/tileSize);
        }
        if (this.x > prevX) this.dir = RIGHT;
        if (this.x < prevX) this.dir = LEFT;
        if (this.y > prevY) this.dir = DOWN;
        if (this.y < prevY) this.dir = UP;

    }

    this.placeBomb = function(){
        if (bombs.length < this.max_bombs){
            if (matrix[this.yind][this.xind] === 0){
                bombs.push(new Bomb(this.xind, this.yind, 50, 2, this.bomb_reach));
                matrix[this.yind][this.xind] = 10;
                console.log("bomb placed");
            }else {
                console.log("Not free space!");
            }

        } else {
            console.log("Max bombs placed");
        }
    }

    this.buildBlock = function(){
        if (matrix[this.yind][this.xind] === 0){
            matrix[this.yind][this.xind] = new Block(this.xind*tileSize, this.yind*tileSize, tileSize, WOOD);
            this.teleportToNearestFree();
        }
    }

    this.getUpgrade = function(powerup){
        console.log("Got powerup: " + powerup);
    }

    this.teleportToNearestFree= function(){
        console.log("teleport to nearest");
        if (matrix[this.yind-1][this.xind] === 0){
            this.y-=tileSize;
            return;
        } else if (matrix[this.yind+1][this.xind] === 0){
            this.y+=tileSize;
            return;
        } else if (matrix[this.yind][this.xind-1] === 0){
            this.x-=tileSize;
            return;
        } else if (matrix[this.yind][this.xind+1] === 0){
            this.x+=tileSize;
            return;
        } else {
            console.log("Couldn't find free space!");
        }
    }

    this.collide = function(obj){
        
        if (!obj || obj===0) return false;
        this.hit = collideRectRect(this.x, this.y, this.r, this.r, obj.x,obj.y, obj.r, obj.r);
        //this.hit = collideRectRect(this.x, this.y, this.r*10, this.r*10, obj.x, obj.y, obj.r, obj.r); //collide the cir object into this rectangle object.
        if(this.hit){
            noFill();
            stroke(0,255,0);
            rect(this.x, this.y, this.r, this.r);
            stroke(0,0,255);
            rect(obj.x, obj.y, obj.r, obj.r);
            //console.log("COLLISION");
            //console.log(obj);
        }
        return this.hit;
    }

    this.checkDamage = function(x,y,r){
        this.hit = collideRectRect(x, y, r, r, this.x, this.y, this.r, this.r); //collide the cir object into this rectangle object.
        if(this.hit){
            console.log("Hit by bomb");
            this.hp--;
            if (this.hp===0){
                this.lives--;
                this.hp = this.hpMax;
                this.x = 10;
                this.y = 10;
            }
        }
    }
}

function Block(x, y, r, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
    this.sprite;
    this.unbreakable = false;
    if (this.type === 1)
        this.unbreakable = true;


    switch(this.type){
        case METAL:
            this.sprite = new Sprite(sprites, createVector(0,0), tileSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case TILE:
            this.sprite = new Sprite(sprites, createVector(120,0), tileSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case WOOD:
            this.sprite = new Sprite(sprites, createVector(180,0), tileSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        default:
            this.sprite = new Sprite(sprites, createVector(180,0), tileSizeVec, 0.3, [0], 'vertical', this, false );
            break;
    }

    this.draw = function(){
        this.sprite.render(this.x, this.y);
    }
}

function Bomb(xind,yind, r, fuse, reach, type) {
    this.xind = xind;
    this.yind = yind;
    this.x = xind*tileSize;
    this.y = yind*tileSize;
    this.r = r;
    this.fuse = fuse*1000;
    this.reach = reach || 1;
    this.startTime = millis();
    this.exploded = false;

    this.type = type || 1;
    this.powerups = "";

    var breakLeft = 999;
    var breakRight = 999;
    var breakUp = 999;
    var breakDown = 999;

    this.spriteBomb = new Sprite(sprites, createVector(0,60), tileSizeVec, 0.3, [0,1,2,1], 'vertical', this, false );
    this.spriteExp = new Sprite(sprites, createVector(60,60), tileSizeVec, 0.3, [0,1,0,1,0,1,0], 'vertical', this, true );
    this.spriteExp1 = new Sprite(sprites, createVector(120,60), tileSizeVec, 0.3, [0,1,0,1,0,1,0], 'vertical', this, true ); //left
    this.spriteExp2 = new Sprite(sprites, createVector(180,60), tileSizeVec, 0.3, [0,1,0,1,0,1,0], 'vertical', this, true ); //r
    this.spriteExp3 = new Sprite(sprites, createVector(240,60), tileSizeVec, 0.3, [0,1,0,1,0,1,0], 'vertical', this, true ); //up
    this.spriteExp4 = new Sprite(sprites, createVector(300,60), tileSizeVec, 0.3, [0,1,0,1,0,1,0], 'vertical', this, true ); //down

    this.draw = function(){
        if (!this.exploded){
            if (millis() > this.startTime + this.fuse){
                console.log("explosion");
                this.explode();
            }
            this.spriteBomb.update(1);
            this.spriteBomb.render();
            
        } else {
            //push();
            //translate(this.r/2, this.r/2);
            this.spriteExp.update(1);
            this.spriteExp.render();
            this.spriteExp1.update(1);
            this.spriteExp2.update(1);
            this.spriteExp3.update(1);
            this.spriteExp4.update(1);

            for (var i = 1; i<=this.reach; i++){
                if (breakRight > i)
                    this.spriteExp2.render(this.x+tileSize*i, this.y);
                if (breakLeft > i)
                    this.spriteExp1.render(this.x-tileSize*i, this.y);
                if (breakDown > i)
                    this.spriteExp4.render(this.x, this.y+tileSize*i);
                if (breakUp > i)
                    this.spriteExp3.render(this.x, this.y-tileSize*i);
            }
        }
    }

    this.collide = function(obj){
        if (!this.exploded){
            this.hit = collideRectCircle(obj.x, obj.y, obj.r, obj.r, this.x, this.y, this.r); //collide the cir object into this rectangle object.
            if(this.hit){
                //
            }
            return this.hit;
        }
    }

    this.explode = function(){      ///move block breaking to block class
        
        this.exploded = true;
        matrix[this.yind][this.xind] = 0;
        player.checkDamage(this.xind*tileSize,this.yind*tileSize,tileSize);
        for (var i = 1; i<=reach; i++){
            //console.log(" explosion loop i = " + i);
            if (this.xind-i >= 0 && breakLeft === 999){
                if (matrix[this.yind][this.xind-i] !== 0) {
                    breakLeft = i;
                    if (!matrix[this.yind][this.xind-i].unbreakable){
                        if (round(random(100)>70)){
                            var powerup = 51 + round(random(num_powerups-1));
                            matrix[this.yind][this.xind-i] = new Upgrade(this.xind-i, this.yind, powerup);
                        } else{
                            matrix[this.yind][this.xind-i] = 0;
                        }
                    }
                }
               player.checkDamage((this.xind-i)*tileSize,this.yind*tileSize,tileSize);
            }
            if (this.xind+i <= cols-1 && breakRight === 999){
                if (matrix[this.yind][this.xind+i] !== 0) {
                    breakRight = i;
                    if (!matrix[this.yind][this.xind+i].unbreakable){
                        if (round(random(100)>70)){
                            var powerup = 51 + round(random(num_powerups-1));
                            matrix[this.yind][this.xind+i] = new Upgrade(this.xind+i, this.yind, powerup);
                        } else{
                            matrix[this.yind][this.xind+i] = 0;
                        }
                    }
                }
                player.checkDamage((this.xind+i)*tileSize,this.yind*tileSize,tileSize);
            }
            if (this.yind-i >= 0 && breakUp === 999){
                if (matrix[this.yind-i][this.xind] !== 0){ 
                    breakUp = i;
                    if (!matrix[this.yind-i][this.xind].unbreakable){
                        if (round(random(100)>70)){
                            var powerup = 51 + round(random(num_powerups-1));
                            matrix[this.yind-i][this.xind] = new Upgrade(this.xind, this.yind-i, powerup);
                        } else{
                            matrix[this.yind-i][this.xind] = 0;
                        }
                    }
                }
                player.checkDamage(this.xind*tileSize,(this.yind-i)*tileSize,tileSize);
            }
            if (this.yind+i <= rows-1 && breakDown === 999){
                 if (matrix[this.yind+i][this.xind] !== 0) {
                    breakDown = i;
                    if (!matrix[this.yind+i][this.xind].unbreakable){
                        if (round(random(100)>70)){
                            var powerup = 51 + round(random(num_powerups-1));
                            matrix[this.yind+i][this.xind] = new Upgrade(this.xind, this.yind+i, powerup);
                        } else{
                            matrix[this.yind+i][this.xind] = 0;
                        }
                    }
                 }
                player.checkDamage(this.xind*tileSize,(this.yind+i)*tileSize,tileSize);
            }
        }
    }
}

function Upgrade(x, y, type) {
    this.xind = x;
    this.yind = y;
    this.x = x*tileSize;
    this.y = y*tileSize;
    this.r = tileSize/2;
    this.type = type;
    this.sprite;
    console.log("New upgrade " + x +","+y);

    switch(this.type){
        case FIREPLUS:
            this.sprite = new Sprite(sprites, createVector(0,240), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case FIREBREAK:
            this.sprite = new Sprite(sprites, createVector(30,240), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case HEALTHPLUS:
            this.sprite = new Sprite(sprites, createVector(60,240), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case BUILDER:
            this.sprite = new Sprite(sprites, createVector(90,240), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
         case SPEEDPLUS:
            this.sprite = new Sprite(sprites, createVector(0,270), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case BOMBPLUS:
            this.sprite = new Sprite(sprites, createVector(30,270), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        case LIFEPLUS:
            this.sprite = new Sprite(sprites, createVector(60,270), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
         case QUESTION:
            this.sprite = new Sprite(sprites, createVector(90,270), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
        default:
            this.sprite = new Sprite(sprites, createVector(60,60), upgradeSizeVec, 0.3, [0], 'vertical', this, false );
            break;
    }

    this.draw = function(){
        this.sprite.render(this.x+tileSize/4, this.y+tileSize/4);
    }
}

function Sprite(spritesheet, pos, size, speed, frames, dir, parent, once) {
    this.pos = pos;
    this.size = size;
    this.speed = typeof speed === 'number' ? speed : 0;
    this.frames = frames;
    this._index = 0;
    this.sprites = spritesheet;
    this.dir = dir || 'horizontal';
    this.parent = parent;
    this.once = once;
};

Sprite.prototype = {
    update: function(dt) {
        this._index += this.speed*dt;
    },

    render: function(dx, dy) {
        var frame;
        //console.log(dx);  //This function keeps looping after bombs are destroyed, why?
        if(this.speed > 0) {
            var max = this.frames.length;
            var idx = Math.floor(this._index);
            frame = this.frames[idx % max];

            if(this.once && idx >= max) {
                this.done = true;
                return;
            }
        }
        else {
            frame = 0;
        }


        var x = this.pos.x;
        var y = this.pos.y;

        if(this.dir == 'vertical') {
            y += frame * this.size.x;
        }
        else {
            x += frame * this.size.y;
        }
        var destx = dx;
        var desty = dy;
        if (dx == null && dy == null){ //0 is valid position but evaluated as false
            destx = this.parent.x;
            desty = this.parent.y;
        }
        image(sprites, destx, desty, this.size.x, this.size.y, x, y, this.size.x, this.size.y);
    }
};


function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    xdir = -1;
  } else if (keyCode === RIGHT_ARROW) {
    xdir = 1;
  }
  if (keyCode === UP_ARROW) {
    ydir = -1;
  } else if (keyCode ===DOWN_ARROW) {
    ydir = 1;
  }
  if (keyCode === 32){
    player.placeBomb();
  } else if(keyCode === 69){
    console.log("E pressed");
    player.buildBlock();
  }
  dir = createVector(xdir,ydir);
  if (xdir !== 0 || ydir !==0){
    player.moving = true;
  }
}
function keyReleased(){
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        xdir=0;
    }
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        ydir=0;
    }
    dir = createVector(xdir,ydir);
    if (xdir === 0 && ydir === 0){
        player.moving = false;
    }
}

function mousePressed() {
    //loop();
}

function mouseDragged() {
}
