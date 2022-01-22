class View {
    constructor() {
        this.canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasCenter = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.fps = 0; // 0: No framerate lock
        this.frameCount = 0;
        this.drawAnchor = {
            x: 0,
            y: 0
        };
        this.viewOffset = {
            x: this.drawAnchor.x - this.canvasCenter.x,
            y: this.drawAnchor.y - this.canvasCenter.y
        };
        this.showControls = false;
        this.colors = {
            primary: function(opacity = 1) {return `rgba(200, 160, 230, ${opacity})`},
            player: 'rgba(200, 160, 230, 1)',
            star: 'rgba(250, 130, 130, 1)',
            background: 'rgba(0, 0, 34, 1)',
            textOutline: function(opacity = 1) {return `rgba(150, 110, 180, ${opacity})`}
        };
        this.gridSize = 50;
        this.timeStamps = {};
    }

    clear() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        // this.canvas.width = this.canvas.width;
    }

    updateViewPosition(drawAnchor) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2
        };
        this.drawAnchor = drawAnchor;
        this.viewOffset = {
            x: this.drawAnchor.x - this.canvasCenter.x,
            y: this.drawAnchor.y - this.canvasCenter.y
        };
    }

    drawBackground() {
        const ctx = this.ctx;
        const gridSize = this.gridSize;
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = this.colors.primary(1);
        for(let x = 0; x <= canvas.width + gridSize; x += gridSize) {
            for(let y = 0; y <= canvas.height + gridSize; y += gridSize) {
                ctx.fillRect(
                    x - this.viewOffset.x % gridSize,
                    y - this.viewOffset.y % gridSize,
                    1.5,
                    1.5
                );
            };
        };
    }

    getDrawPosition(absolutePosition) {
        return {
            x: absolutePosition.x - this.viewOffset.x,
            y: absolutePosition.y - this.viewOffset.y
        }
    }
    
    drawTrail(trailParticles) {
        trailParticles.forEach((position, index) => {
            const ctx = this.ctx;
            const drawPosition = this.getDrawPosition(position);
            const opacity = 0.4 - (index / (player.trailParticles.length * 2));
            const thickness = 2;
            ctx.fillStyle = this.colors.primary(opacity);
            ctx.fillRect(drawPosition.x - thickness / 2, drawPosition.y - thickness / 2, thickness, thickness);
        });
    }

    drawOrb(orb) {
        const ctx = this.ctx;
        const drawPosition = this.getDrawPosition(orb.position);
        ctx.moveTo(drawPosition.x, drawPosition.y);
        ctx.arc(drawPosition.x, drawPosition.y, orb.radius, 0, 2 * Math.PI); 
    }

    drawBatch(orbsArray) {
        const ctx = this.ctx;
        const orbsOnScreen = orbsArray.filter(orb => !orb.isOffScreen);
        if(orbsOnScreen[0].type === 'player') {
            const player = orbsArray[0];
            ctx.beginPath();
            ctx.fillStyle = this.colors.player;
            this.drawOrb(player);
            ctx.fill();
            ctx.closePath();
        }

        this.drawTrail(universe.player.trailParticles);

        ctx.beginPath();
        ctx.fillStyle = this.colors.star;
        for(let i = 0; i < orbsOnScreen.length; i ++) {
            orbsOnScreen[i].type !== 'player' && this.drawOrb(orbsArray[i])
        }
        ctx.fill();
        ctx.closePath();
    }

    drawPauseScreen() {
        const ctx = this.ctx;
    
        ctx.fillStyle = this.colors.primary(1);

        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText('[ARROW KEYS]: BOOST', 30, 30);
        ctx.fillText('[SPACE]: ZERO GRAVITY', 30, 50);
        ctx.fillText('[SHIFT]: REVERSE GRAVITY', 30, 70);
        ctx.fillText('[ESCAPE]: PAUSE GAME', 30, 90);

        ctx.strokeStyle = this.colors.textOutline();
        ctx.font = 'bold 84px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME PAUSED', 30, this.canvasCenter.y, this.canvas.width - 60);
        ctx.strokeText('GAME PAUSED', 30, this.canvasCenter.y, this.canvas.width - 60);
    }

    drawFuelDisplay() {
        const ctx = this.ctx;
        const displaySize = {
            width: this.canvas.width,
            height: 5
        };
        ctx.beginPath();
        ctx.strokeStyle = this.colors.primary(0.7);
        ctx.strokeRect(
            this.canvasCenter.x - displaySize.width / 2,
            this.canvas.height - displaySize.height,
            displaySize.width,
            displaySize.height
        );
        ctx.fillStyle = this.colors.primary(0.8);
        ctx.fillRect(
            this.canvasCenter.x - displaySize.width / 2,
            this.canvas.height - displaySize.height,
            (displaySize.width / player.maxFuel) * player.fuel,
            displaySize.height
        )
        ctx.stroke();
        ctx.closePath();
    }

    drawStartScreen() {
        const ctx = this.ctx;
        const opacity = 10 / (this.frameCount ** 1.5 + 0.000001) ;
        ctx.fillStyle = this.colors.primary(opacity);
        
        const margin = 100;
        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';
        ctx.fillText('[ARROW KEYS]: BOOST', margin + 12, this.canvas.height - margin - 60);
        ctx.fillText('[SPACE]: ZERO GRAVITY', margin + 12, this.canvas.height - margin - 40);
        ctx.fillText('[SHIFT]: REVERSE GRAVITY', margin + 12, this.canvas.height - margin - 20);
        ctx.fillText('[ESCAPE]: PAUSE GAME', margin + 12, this.canvas.height - margin);


        ctx.font = 'bold 150px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText('DRIFT', margin, this.canvasCenter.y, this.canvasCenter.x - margin);
        ctx.textAlign = 'right';
        ctx.fillText('AWAY', this.canvas.width - margin, this.canvasCenter.y, this.canvasCenter.x - margin);

        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'right';
        ctx.fillText('CLICK TO START THE GAME', this.canvas.width - margin - 12, this.canvas.height - margin);
    };

    drawInstructions() {
        const ctx = this.ctx;
        ctx.fillStyle = this.colors.primary((this.frameCount - 120) / 100);
        ctx.strokeStyle = this.colors.textOutline((this.frameCount - 120) / 100);
        ctx.font = '30px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText('Collect smaller stars and become the biggest.', this.canvasCenter.x, this.canvasCenter.y - 220);
        ctx.strokeText('Collect smaller stars and become the biggest.', this.canvasCenter.x, this.canvasCenter.y - 220);
        ctx.fillText('Your boost is limited, don\'t waste it.', this.canvasCenter.x, this.canvasCenter.y - 170);
        ctx.strokeText('Your boost is limited, don\'t waste it.', this.canvasCenter.x, this.canvasCenter.y - 170);
    }

    drawWinMessage(framesSinceGameOver) {
        const ctx = this.ctx;
        ctx.fillStyle = this.colors.primary((framesSinceGameOver - 30) / 100);
        ctx.strokeStyle = this.colors.textOutline((framesSinceGameOver - 30) / 100);
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('You are the biggest now.', this.canvasCenter.x, this.canvasCenter.y - 210);
        ctx.strokeText('You are the biggest now.', this.canvasCenter.x, this.canvasCenter.y - 210);

        ctx.fillText('Nobody can take that away from you.', this.canvasCenter.x, this.canvasCenter.y - 160);
        ctx.strokeText('Nobody can take that away from you.', this.canvasCenter.x, this.canvasCenter.y - 160);

        ctx.fillText('Thank you for playing.', this.canvasCenter.x, this.canvasCenter.y + 160);
        ctx.strokeText('Thank you for playing.', this.canvasCenter.x, this.canvasCenter.y + 160);
    }

    drawLoseMessage(framesSinceGameOver) {
        const ctx = this.ctx;
        ctx.fillStyle = this.colors.primary((framesSinceGameOver - 30) / 100);
        ctx.strokeStyle = this.colors.textOutline((framesSinceGameOver - 30) / 100);
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if(player.isAlive) {
            ctx.fillText('You can\'t become the biggest anymore.', this.canvasCenter.x, this.canvasCenter.y - 210);
            ctx.strokeText('You can\'t become the biggest anymore.', this.canvasCenter.x, this.canvasCenter.y - 210);

            ctx.fillText('That\'s okay.', this.canvasCenter.x, this.canvasCenter.y - 160);
            ctx.strokeText('That\'s okay.', this.canvasCenter.x, this.canvasCenter.y - 160);
        } else {
            ctx.fillText('You helped another star become bigger.', this.canvasCenter.x, this.canvasCenter.y - 210);
            ctx.strokeText('You helped another star become bigger.', this.canvasCenter.x, this.canvasCenter.y - 210);

            ctx.fillText('That\'s nice.', this.canvasCenter.x, this.canvasCenter.y - 160);
            ctx.strokeText('That\'s nice.', this.canvasCenter.x, this.canvasCenter.y - 160);
        }

        ctx.fillText('Thank you for playing.', this.canvasCenter.x, this.canvasCenter.y + 160);
        ctx.strokeText('Thank you for playing.', this.canvasCenter.x, this.canvasCenter.y + 160);
    }

    drawAll(orbsArray) {
        const ctx = this.ctx;
        
        if(gamePaused) {
            this.drawBatch(orbsArray);
            this.drawPauseScreen();
        } else {
            this.drawBackground();
            this.drawBatch(orbsArray);
            if(this.frameCount > 60 * 2 && this.frameCount < 60 * 8 && !gameOver) {
                this.drawInstructions();
            }
            this.drawFuelDisplay();
            if(gameOver) {
                const framesSinceGameOver = this.frameCount - this.timeStamps.gameOver;
                gameWon ? this.drawWinMessage(framesSinceGameOver) : this.drawLoseMessage(framesSinceGameOver);
            }
            if(this.frameCount < 900) {
                this.drawStartScreen();
            }
        }
    }

    isOffScreen(orb) {
        const drawAnchor = this.drawAnchor;
        const canvasCenter = this.canvasCenter;
        const offScreenX = orb.position.x < drawAnchor.x - canvasCenter.x - orb.radius || orb.position.x > drawAnchor.x + canvasCenter.x + orb.radius;
        const offScreenY = orb.position.y < drawAnchor.y - canvasCenter.y - orb.radius || orb.position.y > drawAnchor.y + canvasCenter.y + orb.radius;
        return offScreenX || offScreenY;
    }
}