class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }

    /**
     * Get magnitude of a vecotr
     * equation -> sqart(square of x component + square of y component)
     * @returns 
     * 
     */
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * returns the normal vector
     * @returns {Vector}
     */
    normal() {
        return new Vector(-this.y, this.x).unit();
    }

    /**
     * create a unit vector
     * unit vector = all components / magnitude of the vector
     */
    unit() {
        const magnitude = this.magnitude();
        return (magnitude === 0) ?
            new Vector(0, 0) : new Vector(this.x / magnitude, this.y / magnitude);
    }

    /**
     * Draws the representation of a vector (visual only)
     * @param {number} startx initial x coordinate
     * @param {*} starty initial y coordinate
     * @param {*} n to specify length of the vector
     * @param {*} color to specify the color of the vector
     */
    drawVector(startx, starty, n, color) {
        ctx.beginPath();
        ctx.moveTo(startx, starty);
        ctx.lineTo(startx + this.x * n, starty + this.y * n);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Implementation of vector dot product
     * product = x1 + x2 * y1 + y2
     * or 
     * |v1| * |v2| * cos(angle)
     * @param {Vector} v1
     * @param {Vector} v2
     * @returns {number} number that represents the dot product
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    /**
     * Implementation of vector cross product
     * - product = x1 * y2 - y1 * x2
     * @param {Vector} v1 first vector 
     * @param {Vector} v2 second vector
     * @returns {number} number that represents the cross product
     */
    static cross(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }

    /**
     * Returns the distance between two vectors
     * @param {Vector} v1 first vector
     * @param {Vector} v2 second vector
     * @returns {number} distance between the 2 vectors
     */
    static distance(v1, v2) {
        return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y, v1.y) ** 2);
    }

    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
}