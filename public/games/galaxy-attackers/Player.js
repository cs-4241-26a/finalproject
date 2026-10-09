import Bullet from "./Bullet.js"

export default class Player {
    right = false;
    left = false;
    space = false;

    constructor(canvas, velocity) {
        this.canvas = canvas;
        this.velocity = velocity;

        this.width = 50;
        this.height = 50;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - this.width * 2;

        this.image = new Image();
        this.image.src = "sprites/galaxy_player.png"

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }

    draw(context) {
        this.move();
        this.collideWalls();

        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collideWalls() {
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }
    }

    move() {
        if (this.right) {
            this.x += this.velocity;
        }
        else if (this.left) {
            this.x -= this.velocity;
        }
    }

    keydown = event => {
        if (event.code == "ArrowRight") {
            this.right = true;
            //console.log(this.x, ", ", this.y);
        }
        if (event.code == "ArrowLeft") {
            this.left = true;
            //console.log(this.x, ", ", this.y);
        }
        if (event.code == "Space") {
            this.space = true;
        }
    }

    keyup = event => {
        if (event.code == "ArrowRight") {
            this.right = false;
        }
        if (event.code == "ArrowLeft") {
            this.left = false;
        }
        if (event.code == "Space") {
            this.space = false;
        }
    }
}
