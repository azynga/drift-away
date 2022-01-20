const universe = new Universe(
    new View(),
    new Player(
        { x: 0, y: 0},
        20,
        7
    ),
    new Star(
        {x: 0, y: 500},
        50,
        7,
        true
    )
);

// console.dir(window.localStorage);

const player = universe.orbs[0];
const firstStar = universe.orbs[1];
const fps = universe.view.fps;
let gameStarted = false;
let gamePaused = false;
player.velocity = {x: 1.3, y: 0};

// universe.orbs.push(new Star(
//     {x: 100000, y: 0},
//     80,
//     10,
//     true
// ))

const setup1 = () => {
    for(let i = 0; i < 100; i ++) {
        universe.orbs.push(new Star(...universe.generateStarProperties(
            { x: 0, y: 0 }, // center position
            20000, // spread width
            10000, // spread height
            80, // max radius
            10, // max density
            true
        )));
    }
}

const setup2 = () => {
    for(let i = 0; i < 300; i ++) {
        universe.orbs.push(new Star(...universe.generateStarProperties(
            { x: 0, y: 0 }, // center position
            6000, // spread width
            3000, // spread height
            10, // max radius
            1, // max density
            true
        )));
    }
}

const setup3 = () => {
    for(let i = 0; i < 30; i ++) {
        universe.orbs.push(new Star(...universe.generateStarProperties(
            { x: 0, y: 0 }, // center position
            undefined, // spread width
            undefined, // spread height
            100, // max radius
            3, // max density
            true
        )));
    }
}

const startGame = () => {
    if(!gameStarted) {
        gameStarted = true;
        universe.orbs[1].fixed = false;
        setup2();
    }
};

window.addEventListener('click', startGame);

const update = () => {
    // console.log('NUMBER OF ORBS: ' + universe.orbs.length);
    universe.view.clear();
    universe.updatePositions();
    universe.view.drawAll(universe.orbs);
    updateSounds();
    if(gameStarted) {
        universe.view.frameCount ++;
    }

    if(!gamePaused) {
        if(fps) {
            setTimeout(() => {
                requestAnimationFrame(update);
            }, 1000 / fps)
        } else {
            requestAnimationFrame(update);
        }
    }
}

update();
