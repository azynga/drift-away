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

document.addEventListener('keydown', event => {
    const pressedKey = event.key;
    if(pressedKey in controls && gameStarted) {
        controls[pressedKey](true);
    }
})

document.addEventListener('keyup', event => {
    const releasedKey = event.key;
    if(releasedKey in controls && gameStarted) {
        controls[releasedKey](false);
    }
})