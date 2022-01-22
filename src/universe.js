class Universe {
    constructor(view, player, firstStar) {
        this.defaultGravity = 3e-4;
        this.gravityConstant = this.defaultGravity;
        this.size = {
            x: 10000,
            y: 6000
        };
        this.view = view;
        this.orbs = [player, firstStar];
        this.player = player;
    }

    generateStarProperties(center, areaWidth = this.size.x + 2000, areaHeight = this.size.y + 2000, maxRadius, maxDensity, spawnOffScreen) {
        const startPosition = {
            x: center.x + (Math.random() - 0.5) * areaWidth,
            y: center.y + (Math.random() - 0.5) * areaHeight
        };
        const radius = Math.random() * maxRadius;
        const density = 7; //Math.random() * maxDensity;
        const fixed = radius >= 60;
        const orbDummy = {
            position: startPosition,
            radius: radius
        }
        
        if(spawnOffScreen && !this.view.isOffScreen(orbDummy)) {
            console.log('Create another star, because first attempt was on screen')
            return this.generateStarProperties(...arguments);
        } else {
            return [
                startPosition,
                radius,
                density,
                fixed
            ];
        }
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

    getBiggestOrb() {
        const biggestOrb = this.orbs.reduce((currentBiggest, current) => {
            return currentBiggest.mass > current.mass ? currentBiggest : current;
        })
        return biggestOrb;
    }

    getTotalOrbMass() {
        const totalMass = this.orbs.reduce((total, currentOrb) => {
            return total + currentOrb.mass;
        }, 0);
        return totalMass;
    }
};