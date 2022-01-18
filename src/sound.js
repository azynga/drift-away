const audioContext = new AudioContext();

window.addEventListener('keydown', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

function distortionCurve(amount=20) {
    let n_samples = 256, curve = new Float32Array(n_samples);
    for (let i = 0 ; i < n_samples; ++i ) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

// const audioElement = document.querySelector('audio');
// const track = audioContext.createMediaElementSource(audioElement);
// track.connect(audioContext.destination);
// audioElement.play();

const sine = audioContext.createOscillator();
const gainNode = audioContext.createGain();
const distorter = audioContext.createWaveShaper();
distorter.curve = distortionCurve(10);
sine.type = "sine";
sine.connect(gainNode);
gainNode.gain.value = 0;
sine.start();
setInterval(() => {
    sine.frequency.exponentialRampToValueAtTime(player.getCurrentMovement().speed * 20, 0.5) //player.getCurrentMovement().speed * 100;
    gainNode.gain.exponentialRampToValueAtTime(player.getTotalGravitationalPull().sum / player.mass, 0.5);
    if(!player.isAlive || gamePaused) {
        sine.stop();
    }
}, 1000/60);
gainNode.connect(distorter);
distorter.connect(audioContext.destination);