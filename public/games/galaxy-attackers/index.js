import Player from "./Player.js";
import Enemy_Bee from "./Enemy_Bee.js";
import Bullet from "./Bullet.js"
import enemy_manager from "./enemy_manager.js"
import enemy_bullet from "./enemy_bullet.js"
import Enemy_Bullet from "./enemy_bullet.js";



const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const COOLDOWN_TIME = 5;
let cooldown = COOLDOWN_TIME;
let playerScore = 0;
let playerLives = 3;
let isGameOver = false;
let heartCooldown = false;
const HEART_COOLDOWN = 500;
let pressedStart = false;
let gameInterval = null;

canvas.width = 450;
canvas.height = 550;

const background = new Image();
const background_2 = new Image();

let background_height = 0;
let background_2_height = -canvas.height;

const heart = new Image();
background.src = "sprites/galaxy_background.png";
heart.src = "sprites/galaxy_player.png"

const shoot_sound = new Audio("sounds/laserShoot.wav");
const enemy_spawn = new Audio("sounds/enemy_spawn.wav");
const player_hit = new Audio("sounds/player_hit.wav");
const player_destroyed = new Audio("sounds/player_destroyed.wav");
const next_level = new Audio("sounds/next_level.wav");


background.onload = function() {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "bold 40px Arial";
    context.fillStyle = "lightslateblue";
    context.strokeStyle = "darkslateblue";
    context.lineWidth = 3;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText("PRESS START", canvas.width / 2, canvas.height / 2);
    context.strokeText("PRESS START", canvas.width / 2, canvas.height / 2);
}
heart.onload = function() {
    console.log("Heart image loaded.");
}
//canvas.style.background = "darkslategrey";

const player = new Player(canvas, 4.5);
let bullets = [];
let enemies = [];
let enemy_bullets = [];


const enemy_manager1 = new enemy_manager(canvas, player);

let temp = true;

function game() {
    if (isGameOver) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, background_height, canvas.width, canvas.height);
    context.drawImage(background, 0, background_2_height, canvas.width, canvas.height);

    background_height += 1;
    background_2_height +=1;

    if(background_height >= canvas.height){
        background_height = -canvas.height;
        background_2_height = 0;
    } else if (background_2_height >= canvas.height){
        background_2_height = -canvas.height;
        background_height = 0;
    }

    player.draw(context);

    for (let i = 0; i < playerLives; i++) {
        context.drawImage(heart, 10 + i * 65, 10, 50, 50);
    }

    enemy_manager1.score = playerScore;

    if(temp === true){
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


        next_level.currentTime = 0;
        next_level.play();
        delay(1700).then(() => {
            next_level.currentTime = 0;
            next_level.play();
        });




        delay(3000).then(() => {

            //if(playerScore >= 300){
                if(!isGameOver){
                    enemy_manager1.spawn_enemy_block();
                    enemy_spawn.currentTime = 0;
                    enemy_spawn.play();
                }
            //}

            if(playerScore >= 300){
                delay(1500).then(() => {
                    if(!isGameOver){
                        enemy_manager1.spawn_enemy_block_left();
                        enemy_spawn.currentTime = 0;
                        enemy_spawn.play();
                    }
                });
            }


            if(playerScore >= 700){
                delay(3000).then(() => {
                    if(!isGameOver){
                        enemy_manager1.spawn_enemy_column();
                        enemy_spawn.currentTime = 0;
                        enemy_spawn.play();
                    }
                });
            }

            if(playerScore >= 1500){
                delay(4500).then(() => {
                    if(!isGameOver){
                        enemy_manager1.spawn_enemy_column_left();
                        enemy_spawn.currentTime = 0;
                        enemy_spawn.play();
                    }
                });
            }

            if(playerScore >= 2000){
                delay(6000).then(() => {
                    if(!isGameOver){
                        enemy_manager1.spawn_enemy_column_center();
                        enemy_spawn.currentTime = 0;
                        enemy_spawn.play();
                    }
                });
            }
        })


        temp = false;
        console.log(temp);
    }

    if(enemy_manager1.this_list.length > 0){
        enemy_manager1.this_list.forEach(enemy => {
            enemies.push(enemy);
        });
    }
    
    enemy_manager1.this_list = [];

    if (enemies.length > 0){
        enemies.forEach(enemy => {
            enemy.draw(context);
            if(enemy.shooting){
                enemy.shooting = false;
                const enemy_bullet_1 = new Enemy_Bullet(canvas, 3);
                enemy_bullet_1.x = enemy.x;
                enemy_bullet_1.y = enemy.y;
                enemy_bullets.push(enemy_bullet_1);
            }
            //console.log("enemy drawn");
        });
    }// else {
    //    temp = true;
    //}

    if (cooldown > 0){
        cooldown -= 1;
    }

    let bullet_count = 0;
    bullets.forEach(bullet => {
        if(bullet.y < -(bullet.height*2)){
            bullets.splice(bullet_count, 1);
            bullet_count--;
            bullet = null;
        } else {
            let enemy_count = 0;
            enemies.forEach(enemy => {
                if(is_collision(bullet, enemy)){
                    bullets.splice(bullet_count, 1);
                    bullet_count--;
                    enemies.splice(enemy_count, 1);
                    enemy_count--;
                    updateScore(enemy);
                    if(enemies.length <= 0){
                        temp = true;
                    }
                } else {
                    enemy_count++;
                }
            })
            bullet.draw(context);
        }
        bullet_count++
    });

    let enemy_bullet_count = 0;
    enemy_bullets.forEach(this_enemy_bullet => {
        if (this_enemy_bullet.y > canvas.height + this_enemy_bullet.width){
            enemy_bullets.splice(enemy_bullet_count, 1);
            enemy_bullet_count--;
            this_enemy_bullet = null;
        } else {
            if(is_collision(this_enemy_bullet, player)){
                enemy_bullets.splice(enemy_bullet_count, 1);
                enemy_bullet_count--;
                decreaseLives();
            }
            this_enemy_bullet.draw(context);
        }
        enemy_bullet_count++;
    });

    

    //Check player and enemy collision
    enemies.forEach(enemy => {
        if(is_collision(player, enemy)) {
            if(!enemy.spawning){
                decreaseLives();
            }
        }
    });

    
    if (playerLives === 0) {
        player_destroyed.currentTime = 0;
        player_destroyed.play();
        gameOver();
    }
}

window.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    if (player.space) {
        if (cooldown <= 0){
            const bullet = new Bullet(canvas, 6);

            bullet.x = player.x + player.width / 2 - bullet.width / 2;
            bullet.y = player.y + bullet.height;
            
            bullets.push(bullet);
            player.space = false;
            cooldown = COOLDOWN_TIME;
            shoot_sound.currentTime = 0;
            shoot_sound.play();
        }
    }
});

//check collisions between rectangles
function is_collision(obj1, obj2){
    return(
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

//Prevents window from moving down when spacebar is pressed.
window.addEventListener('keydown', function(e) {
  if (e.key === ' ' || e.keyCode === 32) {
    e.preventDefault();
  }
});

startButton.addEventListener('click', (event) => {
    if (gameInterval != null) {
        return;
    }

    isGameOver = false;
    pressedStart = true;
    gameInterval = setInterval(game, 1000 / 60);
});
resetButton.addEventListener('click', (event) => {
    resetGame();
});

function decreaseLives() {
    if (heartCooldown) {
        console.log("Heart cooldown.");
        return;
    }

    playerLives--;
    player_hit.currentTime = 0;
    player_hit.play();
    heartCooldown = true;

    setTimeout(() => {
        heartCooldown = false;
        console.log("Heart cooldown over.");
    }, HEART_COOLDOWN);
}

function resetGame() {
    isGameOver = true;
    
    if (gameInterval !== null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    pressedStart = false;

    context.fillStyle = "lightslateblue";
    context.strokeStyle = "darkslateblue";
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.fillText("PRESS START", canvas.width / 2, canvas.height / 2);
    context.strokeText("PRESS START", canvas.width / 2, canvas.height / 2);
    
    enemies.forEach(enemy => {
        enemy = null;
    });
    enemies = [];

    bullets.forEach(bullet => {
        bullet = null;
    });
    bullets = [];

    enemy_bullets.forEach(enemy_bullet => {
        enemy_bullet = null;
    });
    enemy_bullets = [];

    cooldown = COOLDOWN_TIME;

    playerScore = 0;
    playerLives = 3;
    const scoreLabel = document.querySelector("#score");
    scoreLabel.textContent = playerScore;

    player.x = canvas.width / 2;
    player.y = canvas.height - player.height * 2;

    temp = true;
}

function gameOver() {
    isGameOver = true;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "bold 40px Arial";
    context.fillStyle = "red";
    context.strokeStyle = "darkred";
    context.lineWidth = 3;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    context.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);

    // Tell the page the game ended; /leaderboard.js submits the score.
    window.dispatchEvent(new CustomEvent("arcade:game-over", { detail: { score: playerScore } }));
}

function updateScore(enemy) {
    if (!enemy.at_home) {
        playerScore += 20;
    }
    else {
        playerScore += 10;
    }

    const scoreLabel = document.querySelector("#score");
    scoreLabel.textContent = playerScore;
}
