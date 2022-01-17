document.addEventListener('keydown', (event) => {
    const key = event.key;

    switch(key) {
        case 'ArrowUp':
            player.setBoost('up');
            break;
        case 'ArrowDown':
            player.setBoost('down');
            break;
        case 'ArrowLeft':
            player.setBoost('left');
            break;
        case 'ArrowRight':
            player.setBoost('right');
            break;
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key;

    switch(key) {
        case 'ArrowLeft':
            player.boost.x = 0;
            break;
        case 'ArrowRight':
            player.boost.x = 0;
            break;
        case 'ArrowUp':
            player.boost.y = 0;
            break;
        case 'ArrowDown':
            player.boost.y = 0;
            break;
    }
})

document.addEventListener('keydown', (event) => {
    const key = event.key;

    switch(key) {
        case 'c':
            universe.gravityConstant = 0;
            break;
        case 'x':
            universe.gravityConstant = 3 * universe.defaultGravity;
            break;
        case 'y':
            universe.gravityConstant = -universe.defaultGravity;
            break;
        case 'Enter':
            universe.view.showControls = !universe.view.showControls;
            break;
        case 'Escape':
            gamePaused = !gamePaused;
            update();
            break;
    };
});

document.addEventListener('keyup', (event) => {
    const key = event.key;

    switch(key) {
        case 'c':
            universe.gravityConstant = universe.defaultGravity;
            break;
        case 'x':
            universe.gravityConstant = universe.defaultGravity;
            break;
        case 'y':
            universe.gravityConstant = universe.defaultGravity;
            break;
    };
});