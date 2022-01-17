class Star extends Orb {
    constructor(position, radius, density = 1, fixed) {
        super(position, radius, density, fixed);
        this.type = 'star';
    }
}