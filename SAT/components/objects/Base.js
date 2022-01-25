class Base {
    constructor(x, y, mass, elasticity) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.mass = mass;
        this.elasticity = elasticity || 1;
    }
}