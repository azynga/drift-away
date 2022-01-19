const audioContext = new AudioContext();
const audioElement = document.querySelector('audio');

window.addEventListener('keydown', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    audioElement.play();
});

function distortionCurve(amount=20) {
    let n_samples = 256, curve = new Float32Array(n_samples);
    for (let i = 0 ; i < n_samples; ++i ) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}


const track = audioContext.createMediaElementSource(audioElement);
const sine = audioContext.createOscillator();
const gainNode = audioContext.createGain();
const distorter = audioContext.createWaveShaper();
const lowPass = audioContext.createBiquadFilter();

lowPass.type.value = 'lowpass';


track.connect(lowPass);

distorter.curve = distortionCurve(10);
sine.type = "sine";
sine.connect(gainNode);
gainNode.gain.value = 0;
sine.start();
setInterval(() => {
    lowPass.frequency.exponentialRampToValueAtTime(150 + (player.getTotalGravitationalPull().sum  / player.mass) * 30000, 0.5);
    sine.frequency.exponentialRampToValueAtTime(player.getCurrentMovement().speed * 20, 0.5) //player.getCurrentMovement().speed * 100;
    gainNode.gain.exponentialRampToValueAtTime(0.001 + player.getTotalGravitationalPull().sum / player.mass, 0.5);
    if(!player.isAlive || gamePaused) {
        sine.stop();
    }
}, 1000/60);
lowPass.connect(audioContext.destination);
gainNode.connect(distorter);
distorter.connect(audioContext.destination);