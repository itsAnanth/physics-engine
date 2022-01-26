class Wall {
    constructor(x1, y1, x2, y2) {
        this.start = new Vector(x1, y1);
        this.end = new Vector(x2, y2);
        Global.walls.push(this);
    }

    drawWall() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    unit() {
        return this.end.subtract(this.start).unit();
    }

    /**
     * 
     * @param {Ball} b ball object
     * @param {Wall} w wall object
     * @returns {Vector} returns the intersecting vector in the directing of the wall
     */
    static closestPoint(b, w) {
        let start = w.start.subtract(b.pos);
        if (Vector.dot(w.unit(), start) > 0) 
            return w.start;
        
        let end = b.pos.subtract(w.end);
        if (Vector.dot(w.unit(), end) > 0)
            return w.end;
        
        let distance = Vector.dot(w.unit(), start);
        let vector = w.unit().multiply(distance);
        return w.start.subtract(vector);
    }

    static collision(b, w) {
        let closestPoint = Wall.closestPoint(b, w).subtract(b.pos);
        return (closestPoint.magnitude() <= b.r);
    }

    static penetration_resolution(b, w) {
        let penetrationVec = b.pos.subtract(Wall.closestPoint(b, w));
        b.pos = b.pos.add(penetrationVec.unit().multiply(b.r - penetrationVec.magnitude()))
    }

    static collision_resolution(b, w) {
        let normal = b.pos.subtract(this.closestPoint(b, w)).unit();
        let seperatingVel = Vector.dot(b.vel, normal);
        let new_seperatingVel = -seperatingVel * b.elasticity;
        let diff = seperatingVel - new_seperatingVel;
        b.vel = b.vel.add(normal.multiply(-diff));
    }
}