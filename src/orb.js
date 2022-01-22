class Orb {
    constructor(position, radius, density = 1, fixed = false) {
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
        this.volume = (4/3) * Math.PI * this.radius ** 3;
        this.density = density;
        this.mass = this.volume * this.density;
    }

    getCurrentMovement() {
        const direction = Math.atan2(this.velocity.y, this.velocity.x);
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const currentMovement = {
            direction: direction,
            speed: speed
        };
        return currentMovement;
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

    getSingleGravitationalPull(otherObject) {
        if(otherObject === this) { // No acceleration if both objects are the same
            return {
                x: 0,
                y: 0,
                sum: 0
            }
        }
        const angle = this.getRelation(otherObject).angle;
        const distance = this.getRelation(otherObject).distance;
        let gravity = (universe.gravityConstant * this.mass * otherObject.mass) / distance ** 2;
        
        const gravitationalPull = {
            x: Math.cos(angle) * gravity,
            y: Math.sin(angle) * gravity,
            sum: Math.abs(gravity)
        };
        return gravitationalPull;
    }

    getTotalGravitationalPull() {
        const orbs = universe.orbs;
        const gravityCollection = orbs.map(orb => {
            return this.getSingleGravitationalPull(orb);
        });
        const isOffScreen = universe.view.isOffScreen(this);
        const relevantGravity = gravityCollection.filter(gravity => gravity.sum > 0.001);

        // Remove orb if gravitational influence is too low
        if(relevantGravity.length === 0 && universe.gravityConstant !== 0 && isOffScreen) {
            orbs.splice(orbs.indexOf(this), 1);
            console.log('Orb removed because of low gravity influence');
            console.log('Remaining orbs: ' + universe.orbs.length);
        };

        const totalGravity = relevantGravity.reduce((totalGravity, singleGravity) => {
            return {
                x: totalGravity.x + singleGravity.x,
                y: totalGravity.y + singleGravity.y,
                sum: totalGravity.sum + singleGravity.sum
            };
        }, { x: 0, y: 0, sum: 0 });

        return totalGravity;
        
        // return {
        //     x: totalGravity.x,
        //     y: totalGravity.y,
        //     sum: Math.sqrt(totalGravity.x ** 2 + totalGravity.y ** 2)
        // };
    }

    applyGravity() {
        const totalGravity = this.getTotalGravitationalPull();

        this.acceleration.x = (totalGravity.x / this.mass);
        this.acceleration.y = (totalGravity.y / this.mass);

        if(this.type === 'player' && this.boostActive && this.fuel > 0) {
            this.acceleration.x += this.boost.x;
            this.acceleration.y += this.boost.y;
            this.fuel -= 1;
        };

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
    }

    checkCollision(otherObject) {
        const orbs = universe.orbs;
        const {angle, distance} = this.getRelation(otherObject);
        const overlap = otherObject.radius + this.radius - distance;
        const isMoreMassive = this.mass > otherObject.mass;
        if(overlap > 0 && isMoreMassive) {
            otherObject.radius -= overlap;
            const previousVolume = otherObject.volume;
            const newVolume = (4/3) * Math.PI * otherObject.radius ** 3;
            const volumeDifference = previousVolume - newVolume;
            this.mass += volumeDifference * this.density;
            this.volume += volumeDifference;
            this.radius = ((3 * this.volume) / (4 * Math.PI)) ** (1/3);

            if(this.type === 'player') {
                this.fuel += volumeDifference / 1000;
                if(this.fuel > this.maxFuel) {
                    this.fuel = this.maxFuel;
                }
            }

            if(otherObject.radius < 0.1) {
                orbs.splice(orbs.indexOf(otherObject), 1);
                if(otherObject.type === 'player') {
                    otherObject.isAlive = false;
                    console.log('Player was consumed by bigger star');
                } else {
                    console.log('Orb was consumed by bigger star');
                }
                console.log('Remaining orbs: ' + universe.orbs.length);
            }
        }

        // if(overlap > 0 && otherObject !== this) {
        //     const {direction, speed} = this.getCurrentMovement();

        //     // reset to touch point
        //     this.position.x -= Math.cos(direction) * overlap;
        //     this.position.y -= Math.sin(direction) * overlap;

        //     const bounceAngle = direction + angle + Math.PI;
        //     const bounceVelocity = {
        //         x: Math.cos(bounceAngle) * speed * 1,
        //         y: Math.sin(bounceAngle) * speed * 1
        //     }
        //     this.velocity = {...bounceVelocity};
        // } else {
        //     return false;
        // }
    }

    setNextCoordinates() {
        
        if(this.getRelation(player).distance > 10000) {
            universe.orbs.splice(universe.orbs.indexOf(this), 1)
            console.log('Orb removed because of distance')
            console.log('Remaining orbs: ' + universe.orbs.length)
        }

        universe.orbs.forEach(orb => this.checkCollision(orb));
        if(this.fixed) {
            return;
        }
        this.applyGravity();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // this.position.x %= universe.size.x;
        // this.position.y %= universe.size.y;
    }
};