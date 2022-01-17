class Universe {
    constructor(view, player, firstStar) {
        this.defaultGravity = 6e-4;
        this.gravityConstant = this.defaultGravity;
        this.size = {
            x: 20000,
            y: 12000
        };
        this.view = view;
        this.orbs = [player, firstStar];
        this.player = player;
    }

    // addStars(numberOfStars) {
    //     for(let i = 0; i < numberOfStars; i ++) {
    //         this.orbs.push()
    //     }
    // }

    generaterStarProperties(center, areaWidth = this.size.x + 2000, areaHeight = this.size.y + 2000, maxRadius, maxDensity) {
        const startPosition = {
            x: center.x + (Math.random() - 0.5) * areaWidth,
            y: center.y + (Math.random() - 0.5) * areaHeight
        };
        const radius = Math.random() * maxRadius;
        const density = Math.random() * maxDensity;
        const fixed = radius >= 40;
        return [
            startPosition,
            radius,
            density,
            fixed
        ];
    }

    updatePositions() {
        const player = this.player;
        this.view.updateViewPosition(this.player.position);
        if(player.isAlive) {
            player.trailParticles.unshift({...this.player.position});
            if(this.player.trailParticles.length > 1200) {
                player.trailParticles.pop();
            };
        } else {
            player.trailParticles.pop();
        }
        this.orbs.forEach(orb => orb.setNextCoordinates());
    }
};