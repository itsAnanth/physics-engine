class Global { }

Global.FRICTION = 0.05;
Global.ELASTICITY = 1;
/** @type {Ball[]} */
Global.balls = [];
/** @type {Wall[]} */
Global.walls = [];

Global.CONTROLS = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false
}

Global.drawDistance = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    buffer: 300
}

Global.turret = {
    width: 20,
    height: 30
}