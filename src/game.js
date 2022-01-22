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

const player = universe.orbs[0];
const fps = universe.view.fps;

let gameStarted = false;
let gamePaused = false;
let gameWon = false;
let gameLost = false;
let respawnOn = true;

player.velocity = {x: 1.3, y: 0};

const setup1 = () => {
    for(let i = 0; i < 100; i ++) {
        universe.orbs.push(new Star(...universe.generateStarProperties(
            { x: 0, y: 0 }, // center position
            20000, // spread width
            10000, // spread height
            80, // max radius
            10, // max density
            true // spawn off screen
        )));
    }
}

const setup2 = () => {
    for(let i = 0; i < 200; i ++) {
        universe.orbs.push(new Star(...universe.generateStarProperties(
            { x: 0, y: 0 }, // center position
            6000, // spread width
            3000, // spread height
            10, // max radius
            1, // max density
            true // spawn off screen
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
            true // spawn off screen
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

let biggestOrb = {};
let totalMass = 0;
let massOutsideBiggest = 0;

const update = () => {
    universe.view.clear();
    universe.updatePositions();
    universe.view.drawAll(universe.orbs);
    updateSounds();

    if(gameStarted) {
        universe.view.frameCount ++;
    }
    
    biggestOrb = universe.getBiggestOrb();
    totalMass = universe.getTotalOrbMass();
    massOutsideBiggest = totalMass - biggestOrb.mass;

    respawnOn = !gameLost && !gameWon && biggestOrb.radius < 100 && gameStarted;
    gameWon = biggestOrb === player && massOutsideBiggest < player.mass && gameStarted;
    gameLost = (!respawnOn && biggestOrb !== player && massOutsideBiggest < biggestOrb.mass || !player.isAlive) && gameStarted;
    
    if(respawnOn && universe.orbs.length < 100) {
        universe.orbs.push(new Star(...universe.generateStarProperties(
            player.position, // center position
            6000, // spread width
            3000, // spread height
            20, // max radius
            1, // max density
            true // spawn off screen
        )));
        console.log('New orb added')
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
