/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

const acceleration = document.getElementById('acceleration');
const velocity = document.getElementById('velocity');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const players = [];
const bullets = [];


class Bullet extends Ball {
    /**
     * Creates a new ball object with collision detection
     * @param {number} id
     * @param {Vector} destination
     * @param {{ 
     *      x: number, 
     *      y: number, 
     *      radius: number, 
     *      elasticity: number, 
     *      parent: any[], 
     *      isPlayer: boolean,
     *      friction: number
     * }} x player object creation payload
     */
    constructor(id, destination, obj) {
        super(obj);
        this.id = id;
        this.friction = 0;
        this.vel = Vector.subtract(destination, this.pos).unit().multiply(5);
        this.damage = 10;
        this.damageOnCollision = true;
    }

    update() {
        this.pos = Vector.add(this.pos, this.vel);
    }
}

const player = new Ball({ id: 0, x: canvas.width / 2, y: canvas.height / 2, isPlayer: true, parent: players, mass: 8, radius: 15, type: 'player', acceleration: 0.5, damageOnCollision: false });
const enemy = new Ball({ id: 1, x: 300, y: 300, isPlayer: false, parent: players, radius: 20, mass: 10, type: 'player', color: 'blue', damageOnCollision: false });

// setInterval(() => {
//     const mouse = new Vector(player.pos.x, player.pos.y);
//     new Bullet(enemy.id, mouse, { color: enemy.color, x: enemy.pos.x, y: enemy.pos.y, radius: 5, parent: bullets })
// }, 1000)
  
function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    const all = players.concat(bullets);
    all.forEach((/** @type {Ball} */b, index) => {
        b.drawBall();
        if (b.player) b.registerControls();

        for (let i = index + 1; i < all.length; i++) {
            const ball_1 = all[index], ball_2 = all[i];
            if (ball_2.id == ball_1.id || (ball_1.type == 'bullet' && ball_2.type == 'bullet')) continue; 
            if (Ball.collision(ball_1, ball_2)) {
                const player = ball_1.type == 'player' ? ball_1 : ball_2;
                const bullet = ball_1.type == 'bullet' ? ball_1 : ball_2;
                console.log(bullet, player)
                if (bullet && player && (bullet.damageOnCollision || player.damageOnCollision)) {
                    console.log('ye')
                    player.health -= bullet.damage;
                    bullet.destroy();
                    if (player.health <= 0) player.destroy();
                    continue;
                }
                Ball.penetration_resolution(ball_1, ball_2);
                Ball.collision_resoluion(ball_1, ball_2);
            }
        }

        // Global.walls.forEach((wall) => {
        //     if (Wall.collision(Global.balls[index], wall)) {
        //         Wall.penetration_resolution(Global.balls[index], wall);
        //         Wall.collision_resolution(Global.balls[index], wall)
        //     }
        // })
        // b.display();
        if (b.type == 'player') b.displayHealth();
        b.update();
    });


    Global.walls.forEach((w, i) => {
        w.drawWall();
    });



    // Wall.closestPoint(player, wall).subtract(player.pos).drawVector(player.pos.x, player.pos.y, 1, 'red')
    acceleration.innerHTML = `Acceleration: ${Math.round(player.acc.magnitude())}`;
    velocity.innerHTML = `Velocity: ${Math.round(player.vel.magnitude())}`
    requestAnimationFrame(mainLoop);
}



window.addEventListener('keydown', e => Controller.handleKeys(e, player));
window.addEventListener('keyup', e => Controller.handleKeys(e, player));

window.addEventListener('click', e => {
    const mouse = new Vector(e.clientX, e.clientY);
    new Bullet(player.id, mouse, { x: player.pos.x, y: player.pos.y, radius: 5, parent: bullets })
})


requestAnimationFrame(mainLoop);