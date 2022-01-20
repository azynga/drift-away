class Player extends Orb {
    constructor(position, radius, density) {
        super(position, radius, density);
        this.type = 'player';
        this.trailParticles = [{...position}];
        this.isAlive = true;
        this.boostPower = 0.05;
        this.boostActive = false;
        this.boost = { x: 0, y: 0 };
        this.maxFuel = 1000;
        this.fuel = 1000;
    }

    setBoost(direction, active) {
        if(!gamePaused && this.isAlive) {
            switch(direction) {
                case 'up':
                    this.boost.y = active ? -this.boostPower : 0;
                    break;
                case 'down':
                    this.boost.y = active ? this.boostPower : 0;
                    break;
                case 'left':
                    this.boost.x = active ? -this.boostPower : 0;
                    break;
                case 'right':
                    this.boost.x = active ? this.boostPower : 0;
                    break;
            };
            this.boostActive = active;
        }
    };
}