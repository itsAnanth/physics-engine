// ball object

class Ball {
    /**
     * Creates a new ball object with collision detection
     * @param {number} x x coordinate
     * @param {number} y y coordinate
     * @param {number} radius radius of the ball
     * @param {number} mass mass of the ball
     * @param {boolean} player whether the ball is controllable by user or not
     */
    constructor(x, y, radius, mass, elasticity = 1, player) {
        /** @type {Vector} */
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        /** @type {number} */
        this.r = radius;
        /** @type {number} */
        this.mass = mass;
        this.inverse_mass = (mass <= 0) ? 0 : (1 / mass);
        this.elasticity = elasticity;
        this.acceleration = 1;
        this.player = player || false;
        Global.balls.push(this);
    }


    /**
     * main renderer
     */
    drawBall() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Angle.toRadians(360));
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.acc = this.acc.unit().multiply(this.acceleration);
        this.vel = Vector.add(this.vel, this.acc);
        this.vel = this.vel.multiply(1 - Global.FRICTION);
        this.pos = Vector.add(this.pos, this.vel);
    }

    display() {
        this.vel.drawVector(this.pos.x, this.pos.y, this.vel.magnitude(), "green");
        this.acc.unit().drawVector(this.pos.x, this.pos.y, this.acc.magnitude(), "blue");
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(`mass = ${this.mass}`, this.pos.x, this.pos.y - this.r - 15);
        ctx.fillText(`elasticiy = ${this.elasticity}`, this.pos.x, this.pos.y - this.r - 5)
    }

    /**
     * Checks collision between two ball entities
     * @param {Ball} b1 
     * @param {Ball} b2 
     * @returns {boolean} Whether the balls are colliding or not
     */
    static collision(b1, b2) {
        return (b1.r + b2.r >= b2.pos.subtract(b1.pos).magnitude());
    }

    static penetration_resolution(b1, b2) {
        let dist = Vector.subtract(b1.pos, b2.pos);
        let pen_depth = b1.r + b2.r - dist.magnitude();
        let pen_res = dist.unit().multiply(pen_depth / (b1.inverse_mass + b2.inverse_mass));
        b1.pos = Vector.add(b1.pos, pen_res.multiply(b1.inverse_mass));
        b2.pos = Vector.add(b2.pos, pen_res.multiply(-b2.inverse_mass));
    }

    /**
     * principle -> law of conservation of momentum & kinetic energy
     * total moment before = total momentum after
     * m(a)v(a) + m(b)v(b) = m(a)v(a)' + m(b)v(b)'
     * 
     * total kinetic energey before = total kinetic energy after
     * KE = m(v^2) / 2
     * 
     * if sum of ke remains same after collision its called elastic collision
     * @param {Ball} b1
     * @param {Ball} b2
     */
    static collision_resoluion(b1, b2) {
        //collision normal vector
        let normal = b1.pos.subtract(b2.pos).unit();
        //relative velocity vector
        let relVel = b1.vel.subtract(b2.vel);
        //separating velocity - relVel projected onto the collision normal vector
        let sepVel = Vector.dot(relVel, normal);
        //the projection value after the collision (multiplied by -1)
        let new_sepVel = -sepVel * Global.ELASTICITY;

        let sepVelDiff = new_sepVel - sepVel;
        let impulse = sepVelDiff / (b1.inverse_mass + b2.inverse_mass);
        let impulseVec = normal.multiply(impulse);
        // //collision normal vector with the magnitude of the new_sepVel
        // let sepVelVec = normal.multiply(new_sepVel);

        //adding the impulse vector to the original vel. vector
        b1.vel = b1.vel.add(impulseVec.multiply(b1.inverse_mass));
        //adding its opposite to the other balls original vel. vector
        b2.vel = b2.vel.add(impulseVec.multiply(-b2.inverse_mass));
    }

    registerControls() {
        let { LEFT, UP, DOWN, RIGHT } = Global.CONTROLS;
        if (LEFT) {
            this.acc.x = -this.acceleration;
        }
        if (UP) {
            this.acc.y = -this.acceleration;
        }
        if (RIGHT) {
            this.acc.x = this.acceleration;
        }
        if (DOWN) {
            this.acc.y = this.acceleration;
        }
        if (!LEFT && !RIGHT) {
            this.acc.x = 0;
        }
        if (!UP && !DOWN) {
            this.acc.y = 0;
        }
    }
}