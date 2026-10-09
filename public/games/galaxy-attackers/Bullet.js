export default class Bullet {
    constructor (canvas, bVelocity) {
        this.canvas = canvas;
        this.bVelocity = bVelocity;

        this.x = 0;
        this.y = 0;
        this.width = 10;
        this.height = 25;

        this.image = new Image();
        this.image.src = "sprites/galaxy_player_bullet.png"
    }

    draw(context) {
        this.y -= this.bVelocity;
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
