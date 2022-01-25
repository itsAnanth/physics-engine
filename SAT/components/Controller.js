class Controller {
    static handleKeys(e, player) {
        let state = e.type == 'keydown' ? true : false;

        switch (e.key) {
            case 'ArrowUp': case 'w':
                Global.CONTROLS.UP = state;
                break; 
            case 'a': case 'ArrowLeft':
                Global.CONTROLS.LEFT = state;
                break; 
            case 'd': case 'ArrowRight':
                Global.CONTROLS.RIGHT = state;
                break;
            case 'ArrowDown': case 's':
                Global.CONTROLS.DOWN = state;
                break;
        }
    }
}