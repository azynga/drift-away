// document.addEventListener('keydown', (event) => {
//     const key = event.key;
//     if(key === 'ArrowUp') {
//         player.acceleration.y -= 100;
//     }
// })

document.addEventListener('keydown', (event) => {
    const key = event.key;

    switch(key) {
        case 'c':
            universe.gravityConstant = 0;
            setTimeout(() => {
                universe.gravityConstant = universe.defaultGravity;
            }, 2000);
            break;
        case 'x':
            universe.gravityConstant = 3 * universe.defaultGravity;
            setTimeout(() => {
                universe.gravityConstant = universe.defaultGravity;
            }, 2000);
            break;
        case 'y':
            universe.gravityConstant = -universe.defaultGravity;
            setTimeout(() => {
                universe.gravityConstant = universe.defaultGravity;
            }, 2000);
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