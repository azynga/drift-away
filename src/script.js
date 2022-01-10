const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Scene {
    constructor() {
        
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

class Orb {
    constructor() {
        
    }
}

class Player {
    constructor() {
        this.starPosition = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.starGravity = 80;
        this.starRadius = 40;

        this.radius = 10;
        this.position = {
            x: this.starPosition.x,
            y: this.starPosition.y + 100
        }
        this.trailPixels = [];
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.speed = {
            x: 1,
            y: -0.1
        };
        this.abilityActive = false;
    }

    posRelation() {
        const coordinateDiff = {
            x: this.starPosition.x - this.position.x,
            y: this.starPosition.y - this.position.y
        };
    
        const distance = Math.sqrt(coordinateDiff.x ** 2 + coordinateDiff.y ** 2);
        if(distance < this.starRadius + this.radius) {
            this.speed.x = -this.speed.y;
            this.speed.y = -this.speed.x;
        }
        const angle = Math.atan2(coordinateDiff.y, coordinateDiff.x);

        return {
            distance: distance,
            angle: angle
        }
    }

    setGravity() {
        const angle = this.posRelation().angle;
        const distance = this.posRelation().distance;
        const gravity = {
            x: (Math.cos(angle) * this.starGravity) / distance ** 2,
            y: (Math.sin(angle) * this.starGravity) / distance ** 2
        };

        this.acceleration.x = gravity.x;
        this.acceleration.y = gravity.y;

        // console.log('Angle: '+angle);
        // console.log('AccX: '+gravity.x);
        // console.log('SpeedX: '+this.speed.x);
        // console.log('AccY: '+gravity.y);
        // console.log('SpeedY:'+this.speed.y);
    }

    applyAcceleration() {
        this.setGravity();
        this.speed.x += this.acceleration.x;
        this.speed.y += this.acceleration.y;

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(
            this.position.x + this.acceleration.x * 8000,
            this.position.y + this.acceleration.y * 8000
        );
        ctx.stroke();
    }

    setNextCoordinates() {
        this.applyAcceleration();
        this.speed.x += this.acceleration.x / 100;
        this.speed.y += this.acceleration.y / 100;
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        trail.unshift({...player.position});
    }

    
    draw() {
        const drawTrail = () => {
            trail.forEach((position, index) => {
                const opacity = 0.4 - (index / (trail.length * 2));
                const size = 2;
                ctx.fillStyle = `rgba(200, 160, 230, ${opacity})`;
                ctx.fillRect(position.x-size/2, position.y-size/2, size, size);
            });
        }

        this.setNextCoordinates();
        drawTrail();

        ctx.fillStyle = 'rgba(200, 160, 230, 1)';
        ctx.strokeStyle = 'rgba(200, 160, 230, 1)';
        // ctx.font = 'bold 12px sans-serif';
        // ctx.fillText('Space: Zero Gravity for 2s', 30, 40);
        // ctx.fillText('Command: Double Gravity for 2s', 30, 60);
        // ctx.fillText('Option: Reverse Gravity for 2s', 30, 80);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.moveTo(this.starPosition.x, this.starPosition.y);
        ctx.arc(this.starPosition.x, this.starPosition.y, this.starRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

const scene = new Scene();
const player = new Player();
const trail = [];
const fps = 60;

const update = () => {
    scene.clear();
    
    
    if(trail.length > 1200) {
        trail.pop();
    }
    // console.log(player.trailPixels);
    player.draw();
    
    setTimeout(() => {
        requestAnimationFrame(update);

    }, 1000 / fps)
}

update();
// setInterval(() => {
//     console.log(trail)
// }, 1000)

document.addEventListener('keydown', (event) => {
    if(!player.abilityActive){
        const key = event.key;
        const starGravity = player.starGravity;
        player.abilityActive = true;
        
        switch(key) {
            case ' ':
                player.starGravity = 0;
                setTimeout(() => {
                    player.starGravity = starGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
            case 'Meta':
                player.starGravity *= 2;
                setTimeout(() => {
                    player.starGravity = starGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
            case 'Alt':
                player.starGravity *= -1;
                setTimeout(() => {
                    player.starGravity = starGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
        };
    };
});