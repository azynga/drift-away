const controls = {
    'ArrowUp': function(isPressed) {
        if(isPressed) {
            player.setBoost('up', true)
        } else {
            player.setBoost('up', false)
        }
    },
    'ArrowDown': function(isPressed) {
        if(isPressed) {
            player.setBoost('down', true)
        } else {
            player.setBoost('down', false)
        }
    },
    'ArrowLeft': function(isPressed) {
        if(isPressed) {
            player.setBoost('left', true)
        } else {
            player.setBoost('left', false)
        }
    },
    'ArrowRight': function(isPressed) {
        if(isPressed) {
            player.setBoost('right', true)
        } else {
            player.setBoost('right', false)
        }
    },
    ' ': function(isPressed) {
        if(isPressed) {
            universe.gravityConstant = 0;
        } else {
            universe.gravityConstant = universe.defaultGravity;
        }
    },
    'Shift': function(isPressed) {
        if(isPressed) {
            universe.gravityConstant = -universe.defaultGravity;
        } else {
            universe.gravityConstant = universe.defaultGravity;
        }
    },
    'Escape': function(isPressed) {
        if(isPressed) {
            gamePaused = !gamePaused;
            universe.view.showControls = !universe.view.showControls;
            if(!gamePaused) {
                update();
            }
        }
    }
}

const keys = {};

document.addEventListener('keydown', event => {
    const pressedKey = event.key;
    keys[pressedKey] = true;
    for(let key in keys) {
        if(gameStarted && key in controls && keys[key] === true) {
            controls[key](true);
        }
    }
})

document.addEventListener('keyup', event => {
    const releasedKey = event.key;
    keys[releasedKey] = false;
    for (let key in keys) {
        if(key in controls && keys[key] === false) {
            controls[key](false);
        }
    }
})

// document.addEventListener('keydown', (event) => {
//     const key = event.key;

//     switch(key) {
//         case 'ArrowUp':
//             player.setBoost('up');
//             break;
//         case 'ArrowDown':
//             player.setBoost('down');
//             break;
//         case 'ArrowLeft':
//             player.setBoost('left');
//             break;
//         case 'ArrowRight':
//             player.setBoost('right');
//             break;
//     }
// });

// document.addEventListener('keyup', (event) => {
//     const key = event.key;

//     switch(key) {
//         case 'ArrowLeft':
//             player.boost.x = 0;
//             break;
//         case 'ArrowRight':
//             player.boost.x = 0;
//             break;
//         case 'ArrowUp':
//             player.boost.y = 0;
//             break;
//         case 'ArrowDown':
//             player.boost.y = 0;
//             break;
//     }
// })

// document.addEventListener('keydown', (event) => {
//     const key = event.key;

//     switch(key) {
//         case 'c':
//             universe.gravityConstant = 0;
//             break;
//         case 'x':
//             universe.gravityConstant = 3 * universe.defaultGravity;
//             break;
//         case 'y':
//             universe.gravityConstant = -universe.defaultGravity;
//             break;
//         case 'Enter':
//             universe.view.showControls = !universe.view.showControls;
//             break;
//         case 'Escape':
//             gamePaused = !gamePaused;
//             update();
//             break;
//     };
// });

// document.addEventListener('keyup', (event) => {
//     const key = event.key;

//     switch(key) {
//         case 'c':
//             universe.gravityConstant = universe.defaultGravity;
//             break;
//         case 'x':
//             universe.gravityConstant = universe.defaultGravity;
//             break;
//         case 'y':
//             universe.gravityConstant = universe.defaultGravity;
//             break;
//     };
// });