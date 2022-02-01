const count = document.getElementById('count');
const go = document.getElementById('go');
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
const enemies = [];

class Player extends Ball {
    constructor(id, health, obj) {
        super(obj);
        this.id = id;
        this.health = health || 100;
        this.alive = true;
        this.angle = 0;
        this.type = 'player';
    }

    rotate(x, y) {
        ctx.save();
        ctx.translate(x, y)
        ctx.rotate(this.angle + Angle.toRadians(180));
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0 - 10, 0, 20, 30);
        ctx.restore();
    }

    healthbar(x, y, color = 'red') {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = 'black';
        ctx.fillRect(0 - 25, - this.r * 2 - 10, 50, 10);
        ctx.fillStyle = color;
        const fillVal = 44 * this.health / 100
        ctx.fillRect(0 - 22, - this.r * 2 - 8.8, Math.max(0, fillVal), 8)
        ctx.restore();
    }
};

let po = Player.prototype.destroy, db = Player.prototype.drawBall;

Player.prototype.destroy = function () {
    this.alive = false;
    po.apply(this, arguments);
}


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
        this.vel = Vector.subtract(destination, this.pos).unit().multiply(10);
        this.damage = 10;
        this.damageOnCollision = true;
        this.type = 'bullet';
    }

    update() {
        this.pos = Vector.add(this.pos, this.vel);
        if (this.pos.x >= 3000 || this.pos.y >= 3000 || this.pos.x < 0 || this.pos.y < 0)
            this.parent.splice(this.parent.indexOf(this), 1);
    }

}

const player = new Player(0, 100, { x: canvas.width / 2, y: canvas.height / 2, isPlayer: true, parent: players, mass: 8, radius: 15, color: 'cyan', acceleration: 0.5, damageOnCollision: false });
const enemyObj = { x: canvas.width / 2, y: canvas.height / 2, isPlayer: false, parent: enemies, radius: 20, mass: 15, color: 'blue', damageOnCollision: false };

for (let i = 0; i < 5; i++) {
    enemyObj.x += Math.floor(Math.random() * 200) + 500;
    enemyObj.y += Math.floor(Math.random() * 200) + 500;
    enemyObj.acceleration = Math.floor(Math.random() * 5);
    const enemy = new Player(i + 1, 100, enemyObj);
    enemy.lastStamp = Date.now();
}

// new Player(1, 100, );
// new Player(2, 100, { x: canvas.width / 2 - 100, y: canvas.height / 2, isPlayer: false, parent: enemies, radius: 20, mass: 15, color: 'blue', damageOnCollision: false });

// enemy.update = function() {
//     this.pos = Vector.add(this.pos, this.vel);
// }

let int = setInterval(() => {
    enemies.forEach(enemy => {
        if (!enemy.alive) clearInterval(int);
        const diff = Date.now() - enemy.lastStamp
        if (diff > 1000) {
            const mouse = new Vector(player.pos.x, player.pos.y);
            new Bullet(enemy.id, mouse, { color: enemy.color, x: enemy.pos.x, y: enemy.pos.y, radius: 5, parent: bullets })
            enemy.lastStamp = Date.now();
        }


        enemy.vel = Vector.subtract(player.pos, enemy.pos).unit().multiply(enemy.acceleration);
        // enemy.moveTo(new Vector(player.pos.x, player.pos.y))
        const dv = Vector.subtract(player.pos, enemy.pos).unit();
        const radians = -Math.atan2(dv.x, dv.y) + Angle.toRadians(180)
        enemy.angle = radians;
    })
}, 50)

function mainLoop() {
    if (!player.alive || enemies.length == 0) {
        if (enemies.length == 0) go.innerHTML = 'You Won!';
        go.style.opacity = 1;
        return;
    }

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    Renderer.renderWorld(player)
    // player.rotate();
    // player.healthbar();
    player.registerControls()
    const all = [player, ...bullets.concat(enemies)];
    count.innerHTML = `${enemies.length + 1} Alive`;
    all.forEach((b, index) => {
        Renderer.renderEnemies(player, b, (x, y) => {
            if (b.type == 'player') {
                b.healthbar(x, y, b.id == 0 ? 'lightgreen' : 'red');
                b.rotate(x, y);
            }
            b.drawBall(x, y);

        })
        for (let i = index + 1; i < all.length; i++) {
            const ball_1 = all[index], ball_2 = all[i];
            if (ball_2.id == ball_1.id || (ball_1.type == 'bullet' && ball_2.type == 'bullet')) continue;
            if (Ball.collision(ball_1, ball_2)) {
                // console.log(ball_1.type, ball_2.type)
                const player = ball_1.type == 'player' ? ball_1 : ball_2;
                const bullet = ball_1.type == 'bullet' ? ball_1 : ball_2;

                if (bullet && player && (bullet.damageOnCollision || player.damageOnCollision)) {
                    player.health -= bullet.damage;
                    bullet.destroy();
                    // console.log(player.health)
                    if (player.health <= 0)
                        player.destroy();
                    continue;
                }
                Ball.penetration_resolution(ball_1, ball_2);
                Ball.collision_resoluion(ball_1, ball_2);
            }
        }
        Renderer.renderPlayer((x, y) => player.drawBall(x, y))

        b.update();
    })
    // Wall.closestPoint(player, wall).subtract(player.pos).drawVector(player.pos.x, player.pos.y, 1, 'red')
    acceleration.innerHTML = `Acceleration: ${Math.round(player.acc.magnitude())}`;
    velocity.innerHTML = `Velocity: ${Math.round(player.vel.magnitude())}`
    requestAnimationFrame(mainLoop);
}

function getParticles({ x, y }, particles) {
    const dx = particles.filter(p => p.pos.x <= Global.drawDistance.x + x && p.pos.x >= x - Global.drawDistance.x - Global.drawDistance.buffer)
    const dy = dx.filter(p => p.pos.y <= Global.drawDistance.y + y && p.pos.y >= y - Global.drawDistance.y - Global.drawDistance.buffer);
    return dy;
}



window.addEventListener('keydown', e => Controller.handleKeys(e, player));
window.addEventListener('keyup', e => Controller.handleKeys(e, player));

window.addEventListener('click', e => {
    const dx = e.clientX + player.pos.x - window.innerWidth / 2;
    const dy = e.clientY + player.pos.y - window.innerHeight / 2;
    const mouse = new Vector(dx, dy);
    new Bullet(player.id, mouse, { x: player.pos.x, y: player.pos.y, radius: 5, parent: bullets, color: player.color })
})

window.addEventListener('mousemove', e => {
    const radians = Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
    player.angle = radians;
})


requestAnimationFrame(mainLoop);