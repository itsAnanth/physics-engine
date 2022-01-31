// ball object

class Ball {
    /**
     * Creates a new ball object with collision detection
     * @param {{ 
     *      x: number, 
     *      y: number, 
     *      radius: number, 
     *      elasticity: number, 
     *      parent: any[], 
     *      isPlayer: boolean,
     *      friction: number,
     *      damageOnCollision: boolean,
     *      type: string
     *      acceleration: number
     * }} x player object creation payload
     */
    constructor({ x, y, radius, mass, elasticity, parent, isPlayer, friction, damageOnCollision, health, type, acceleration, color }) {
        /** @type {Vector} */
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.health = health ?? 100;
        /** @type {number} */
        this.r = radius ?? 10;
        /** @type {number} */
        this.mass = mass || 5;
        this.inverse_mass = (mass <= 0) ? 0 : (1 / mass);
        this.elasticity = elasticity ?? 1;
        this.acceleration = acceleration ?? 1;
        this.player = isPlayer || false;
        this.friction = friction ?? Global.FRICTION;
        this.parent = parent;
        this.damageOnCollision = damageOnCollision ?? false;
        this.type = type ?? 'entity';
        this.color = color ?? 'red';
        parent.push(this);
    }


    /**
     * main renderer
     */
    drawBall() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Angle.toRadians(360));
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    moveTo(v) {
        this.vel = Vector.subtract(v, this.pos).unit().multiply(this.acceleration);
    }

    displayHealth() {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.fillText(`HP - ${this.health}`, this.pos.x, this.pos.y - this.r - 15);
    }

    update() {
        this.acc = this.acc.unit().multiply(this.acceleration);
        this.vel = Vector.add(this.vel, this.acc);
        this.vel = this.vel.multiply(1 - this.friction);
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


    destroy() {
        this.parent.splice(this.parent.indexOf(this), 1);
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