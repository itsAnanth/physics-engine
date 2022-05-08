class Renderer {

    static renderPlayer(callback) {
        const dx = canvas.width / 2, dy = canvas.height / 2;
        callback(dx, dy);
    }

    // static renderName(x, y, { username, color }) {
    //     ctx.fillStyle = color;
    //     ctx.textAlign = 'center';
    //     ctx.font = `bold ${USERNAME_FONT_SIZE}px Arial`;
    //     ctx.fillText(username, x, y - (PLAYER_RADIUS + USERNAME_FONT_SIZE));
    // }

    static renderEnemies(me, p, callback) {
        const relativeX = p.pos.x - me.pos.x;
        const relativeY = p.pos.y - me.pos.y;

        // if (
        //     relativeX > canvas.height ||
        //     relativeX < -canvas.height ||
        //     relativeY > canvas.width ||
        //     relativeY < -canvas.width
        // ) return;

        callback(relativeX + canvas.width / 2, relativeY + canvas.height / 2);
    }


    static renderWorld(p) {
        const MAP_SIZE = 3000;
        ctx.fillStyle = "#323232";
        ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);
        ctx.lineWidth = 3;
        ctx.save();

        const dx = p.pos.x - canvas.width / 2;
        const dy = p.pos.y - canvas.height / 2;
        ctx.fillStyle = "#121212";
        ctx.strokeStyle = "#635f5f";
        const size = MAP_SIZE / 30;
        for (let x = 0; x < MAP_SIZE; x += size) {
            for (let y = 0; y < MAP_SIZE; y += size) {
                ctx.strokeRect(-dx + x, -dy + y, size, size);
            }
        }

        Renderer.renderBorder(p);

        ctx.restore();
    }

    static renderBorder(p) {
        const PLAYER_RADIUS = p.r
        const MAP_SIZE = 3000;
        const dx = p.pos.x - canvas.width / 2;
        const dy = p.pos.y - canvas.height / 2;
        ctx.strokeStyle = "#010101";
        ctx.strokeRect(
            -dx - PLAYER_RADIUS,
            -dy - PLAYER_RADIUS,
            MAP_SIZE + (PLAYER_RADIUS * 4) / 2,
            MAP_SIZE + (PLAYER_RADIUS * 4) / 2
        );
    }
}
