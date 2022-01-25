class Angle {

    /**
     * 
     * @param {number} angle angle in degrees
     * @returns {number} angle in radians
     */
    static toRadians(angle) {
        return (angle * Math.PI) / 180;
    }

    /**
     * 
     * @param {number} angle angle in radians
     * @returns {number} angle in degrees
     */
    static toDegree(angle) {
        return (angle * 180) / Math.PI;
    }

    /**
     * 
     * @param {number} x x coordinate of origin
     * @param {*} y y coordinate of origin
     * @param {*} radius radius of the circle taken as reference
     * @param {*} angle angle in radians
     * @returns {{ x: number, y: number }} cartesian coordinates of the corresponding point on the circle's circumference from origin
     */
    static toCaretesian(x, y, radius, angle) {
        return { x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) };
    }
}