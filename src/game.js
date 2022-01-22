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
let gameOver = false;
let gameWon = false;
let gameLost = false;
let respawnOn = false;

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

const update = () => {
    universe.view.clear();
    universe.updatePositions();
    universe.view.drawAll(universe.orbs);
    updateSounds();

    if(gameStarted) {
        universe.view.frameCount ++;
    };
    
    const biggestOrb = universe.getBiggestOrb();
    const totalVolume = universe.getTotalOrbVolume();
    const volumeOutsideBiggest = totalVolume - biggestOrb.volume;
    
    if(gameStarted && !gameOver) {
        respawnOn = biggestOrb.radius < 100;
        if(biggestOrb === player && volumeOutsideBiggest < player.volume) {
            gameWon = true;
        } else if(!respawnOn && biggestOrb !== player && volumeOutsideBiggest < biggestOrb.volume || !player.isAlive) {
            gameLost = true;
        };
        gameOver = gameWon || gameLost;
        if(gameOver) {
            universe.view.timeStamps.gameOver = universe.view.frameCount;
            respawnOn = false;
        }
    }

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
