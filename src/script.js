const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const viewCenter = {
    x: canvas.width / 2,
    y: canvas.height / 2
};
const fps = 60;


class Universe {
    constructor() {
        this.defaultGravity = 3e-4;
        this.gravityConstant = this.defaultGravity;
        this.colors = {
            background: 'rgba(0, 0, 34, 1)',
            primary: 'rgba(200, 160, 230, 1)',
            star: 'rgba(250, 130, 130, 1)'
        };
        this.firstStarPosition = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.playerStartPosition = {
            x: this.firstStarPosition.x,
            y: this.firstStarPosition.y + 150
        };
        this.orbs = [];
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawBackground(viewOffset) {
        for(let x = -canvas.width; x < 2 * canvas.width; x += 40) {
            for(let y = -canvas.height; y < 2 * canvas.height; y += 40) {
                const drawPosition = {
                    x: x - viewOffset.x % canvas.width,
                    y: y - viewOffset.y % canvas.height 
                }
                ctx.fillRect(drawPosition.x, drawPosition.y, 1, 1);
            }
        }
    }

    drawSelf() {
        const drawAnchor = {
            x: player.position.x - viewCenter.x,
            y: player.position.y - viewCenter.y
        };

        ctx.fillStyle = this.colors.primary;
        ctx.strokeStyle = this.colors.primary;

        this.drawBackground(drawAnchor);

        // this.drawBackground({
        //     x: drawAnchor.x - canvas.width,
        //     y: drawAnchor.y - canvas.height
        // });

        // draw instructions
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('[Space]: Zero Gravity', 30, 40);
        ctx.fillText('[Command]: Double Gravity', 30, 60);
        ctx.fillText('[Option]: Reverse Gravity', 30, 80);
        
        // draw game objects
        this.orbs.forEach(orb => {
            orb.drawSelf(drawAnchor);
        })
    }
};

class Orb {
    constructor(position, radius, fixed = false) {
        this.position = position;
        this.radius = radius;
        this.fixed = fixed;
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: (Math.random() - 0.5) / 5,
            y: (Math.random() - 0.5) / 5
        }
        this.mass = (4/3) * Math.PI * this.radius ** 3;
    }

    drawSelf(viewOffset) {
        this.setNextCoordinates();
        const drawPosition = {
            x: this.position.x - viewOffset.x,
            y: this.position.y - viewOffset.y
        }
        ctx.fillStyle = universe.colors.star;
        ctx.strokeStyle = universe.colors.primary;
        ctx.beginPath();
        ctx.arc(drawPosition.x, drawPosition.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    getCurrentDirection() {
        const direction = Math.atan2(this.velocity.y, this.velocity.x);
        return direction;
    }

    getRelation(otherObject) {
        const coordinateDiff = {
            x: otherObject.position.x - this.position.x,
            y: otherObject.position.y - this.position.y
        };
    
        const distance = Math.sqrt(coordinateDiff.x ** 2 + coordinateDiff.y ** 2);
        const angle = Math.atan2(coordinateDiff.y, coordinateDiff.x);
        const relation = {
            distance: distance,
            angle: angle
        }
        return relation;
    }

    getAcceleration(otherObject) {
        if(otherObject === this) { // no acceleration if both objects are the same
            return {
                x: 0,
                y: 0
            }
        }
        const angle = this.getRelation(otherObject).angle;
        const distance = this.getRelation(otherObject).distance;
        const gravity = (universe.gravityConstant * this.mass * otherObject.mass) / distance ** 2;
        const acceleration = {
            x: Math.cos(angle) * gravity,
            y: Math.sin(angle) * gravity
        };
        return acceleration;
    }

    applyAcceleration() {
        const orbs = universe.orbs;
        const accCollection = orbs.map(orb => {
            return this.getAcceleration(orb);
        });
        
        const accSum = accCollection.reduce((accSum, orbAcc) => {
            return {
                x: accSum.x + orbAcc.x,
                y: accSum.y + orbAcc.y
            };
        }, { x: 0, y: 0 });

        this.acceleration.x = (accSum.x / this.mass);
        this.acceleration.y = (accSum.y / this.mass);

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
    }

    collision(otherObject) {
        const distance = this.getRelation(otherObject).distance;
        if(distance < otherObject + this.radius) {
            return true;
        } else {
            return false;
        }
    }

    setNextCoordinates() {
        if(this.fixed) {
            return;
        }

        this.applyAcceleration();
        // if(this.collision(universe.orbs[1])) {
        //     this.velocity = { x: 0, y: 0};
        // } else {
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
        // }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
};

class Star extends Orb {
    constructor(position, radius, fixed) {
        super(position, radius, fixed);
    }
}

class Player extends Orb {
    constructor(position, radius) {
        super(position, radius);
        this.trailParticles = [];
        this.velocity = { // test values
            x: 2,
            y: -0.5
        };
        this.abilityActive = false;
    }

    setNextCoordinates() {
        this.applyAcceleration();

        // if(this.collision(universe.orbs[1])) {
        //     this.velocity = { x: 0, y: 0};
        // } else {
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
        // }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        player.trailParticles.unshift({...player.position});
        if(player.trailParticles.length > 1200) {
            player.trailParticles.pop();
        };
    }
    
    drawSelf(viewOffset) {
        this.setNextCoordinates();
        const drawPosition = {
            x: this.position.x - viewOffset.x,
            y: this.position.y - viewOffset.y
        }

        // draw gravity indicator
        ctx.beginPath();
        ctx.moveTo(drawPosition.x, drawPosition.y);
        ctx.lineTo(
            drawPosition.x + this.acceleration.x * 8000,
            drawPosition.y + this.acceleration.y * 8000
        );

        // draw planet
        ctx.moveTo(drawPosition.x, drawPosition.y);
        ctx.arc(drawPosition.x, drawPosition.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // draw trail
        player.trailParticles.forEach((position, index) => {
            const drawPosition = {
                x: position.x - viewOffset.x,
                y: position.y - viewOffset.y
            }
            const opacity = 0.4 - (index / (player.trailParticles.length * 2));
            const thickness = 2;
            ctx.fillStyle = `rgba(200, 160, 230, ${opacity})`;
            ctx.fillRect(drawPosition.x - thickness / 2, drawPosition.y - thickness / 2, thickness, thickness);
        });
    }
}

const universe = new Universe();

// test setup
universe.orbs.push(
    new Player(universe.playerStartPosition, 15),
    new Star(universe.firstStarPosition, 35, false),
    new Star({x: 950, y: 1250}, 80, true)
);
universe.orbs[1].velocity.x = 1.1;

const player = universe.orbs[0];

const update = () => {
    universe.clear();
    universe.drawSelf();
    setTimeout(() => {
        requestAnimationFrame(update);
    }, 1000 / fps)
}

update();

document.addEventListener('keydown', (event) => {
    if(!player.abilityActive){
        const key = event.key;
        player.abilityActive = true;
        
        switch(key) {
            case ' ':
                universe.gravityConstant = 0;
                setTimeout(() => {
                    universe.gravityConstant = universe.defaultGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
            case 'Meta':
                universe.gravityConstant *= 3;
                setTimeout(() => {
                    universe.gravityConstant = universe.defaultGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
            case 'Alt':
                universe.gravityConstant *= -0.5;
                setTimeout(() => {
                    universe.gravityConstant = universe.defaultGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
        };
    };
});