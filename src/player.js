class Player extends Orb {
    constructor(position, radius, density) {
        super(position, radius, density);
        this.type = 'player';
        this.trailParticles = [{...position}];
        this.isAlive = true;
        this.boostPower = 0.05;
        this.boost = { x: 0, y: 0};
        this.fuel = 1000;
    }

    setBoost(direction) {
        if(this.fuel > 0 && !gamePaused && this.isAlive) {
            switch(direction) {
                case 'up':
                    this.boost.y = -this.boostPower;
                    break;
                case 'down':
                    this.boost.y = this.boostPower;
                    break;
                case 'left':
                    this.boost.x = -this.boostPower;
                    break;
                case 'right':
                    this.boost.x = this.boostPower;
                    break;
            };
            this.fuel -= 10;
        }

        console.log(this.fuel)
    };
}