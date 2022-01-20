const universe = new Universe(
    new View(),
    new Player(
        { x: 0, y: 0},
        20,
        10
    ),
    new Star(
        {x: 200, y: 400},
        50,
        7,
        false
    )
);

const player = universe.orbs[0];
const firstStar = universe.orbs[1];
const fps = universe.view.fps;
let gamePaused = false;
player.velocity = {x: 2, y: 0};

// universe.orbs.push(new Star(
//     {x: 100000, y: 0},
//     80,
//     10,
//     true
// ))

const setup1 = () => {
    for(let i = 0; i < 100; i ++) {
        universe.orbs.push(new Star(...universe.generaterStarProperties(
            { x: 0, y: 0 }, // center position
            20000, // spread width
            10000, // spread height
            80, // max radius
            10 // max density
        )));
    }
}

const setup2 = () => {
    for(let i = 0; i < 300; i ++) {
        universe.orbs.push(new Star(...universe.generaterStarProperties(
            { x: 0, y: 0 }, // center position
            4000, // spread width
            2000, // spread height
            10, // max radius
            1 // max density
        )));
    }
}

const setup3 = () => {
    for(let i = 0; i < 30; i ++) {
        universe.orbs.push(new Star(...universe.generaterStarProperties(
            { x: 0, y: 0 }, // center position
            undefined, // spread width
            undefined, // spread height
            100, // max radius
            3 // max density
        )));
    }
}

setup2();

const update = () => {
    // console.log('NUMBER OF ORBS: ' + universe.orbs.length);
    universe.view.clear();
    universe.updatePositions();
    universe.view.drawAll(universe.orbs);
    updateSounds();

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