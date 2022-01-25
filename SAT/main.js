/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

const acceleration = document.getElementById('acceleration');
const velocity = document.getElementById('velocity');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Ball(200, 200, 30, 2, 1, true);
new Ball(300, 200, 60, 10, 1, false);

function mainLoop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    Global.balls.forEach((/** @type {Ball} */b, index) => {
        b.drawBall();
        if (b.player) b.registerControls();

        for (let i = index + 1; i < Global.balls.length; i++) {
            const ball_1 = Global.balls[index], ball_2 = Global.balls[i];
            if (Ball.collision(ball_1, ball_2)) {
                Ball.penetration_resolution(ball_1, ball_2);
                Ball.collision_resoluion(ball_1, ball_2);
            }
        }
        b.display();
        b.update();
    })
    acceleration.innerHTML = `Acceleration: ${Math.round(player.acc.magnitude())}`;
    velocity.innerHTML = `Velocity: ${Math.round(player.vel.magnitude())}`
    requestAnimationFrame(mainLoop);
}



window.addEventListener('keydown', e => Controller.handleKeys(e, player));
window.addEventListener('keyup', e => Controller.handleKeys(e, player));


requestAnimationFrame(mainLoop);