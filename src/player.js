class Player extends Orb {
    constructor(position, radius, density) {
        super(position, radius, density);
        this.type = 'player';
        this.trailParticles = [{...position}];
        this.isAlive = true;
    }
}