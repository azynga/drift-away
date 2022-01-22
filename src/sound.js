const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
audioCtx.suspend();
const backgroundMusicElement = document.querySelector('audio');
// const backgroundMusicElement = new Audio();
// backgroundMusicElement.src = '../sound/music-loop.mp3';
// backgroundMusicElement.crossOrigin = 'anonymous';
const backgroundMusicNode = audioCtx.createMediaElementSource(backgroundMusicElement);
backgroundMusicElement.loop = true;

// create a sequence of white noise
const whiteNoiseBuffer = audioCtx.createBuffer(1, 2 * 44100, 44100);
const whiteNoiseData = whiteNoiseBuffer.getChannelData(0);
for (let i = 0; i < whiteNoiseBuffer.length; i ++) {
    whiteNoiseData[i] = Math.random() * 2 - 1;
}
const whiteNoiseNode = audioCtx.createBufferSource();
whiteNoiseNode.buffer = whiteNoiseBuffer;
whiteNoiseNode.loop = true;


// create audio chain for noise
const noiseLowPass = audioCtx.createBiquadFilter();
noiseLowPass.type.value = 'lowpass';
noiseLowPass.frequency.value = 150;

const noiseGain = audioCtx.createGain();
noiseGain.gain.value = 0.0001;

whiteNoiseNode.connect(noiseLowPass);
noiseLowPass.connect(noiseGain);
noiseGain.connect(audioCtx.destination);
whiteNoiseNode.start();


// create audio chain for music
const musicLowPass = audioCtx.createBiquadFilter();
musicLowPass.type.value = 'lowpass';
musicLowPass.frequency.value = 500;

backgroundMusicNode.connect(musicLowPass);
musicLowPass.connect(audioCtx.destination);

window.addEventListener('click', () => {
    if(audioCtx.state === 'suspended') {
        audioCtx.resume();
        backgroundMusicElement.play();
    };
})

const updateSounds = () => {
    if(!player.isAlive || gamePaused) {
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, 1);
        musicLowPass.frequency.exponentialRampToValueAtTime(100, 1);
    } else {
        // change sounds depending on gravity
        const gravity = player.getTotalGravitationalPull().sum;
        const mass = player.mass;
        const musicCutoff = 150 + (gravity / mass) * 100000;
        const noiseCutoff = 150 + (gravity / mass) * 50000;
        musicLowPass.frequency.exponentialRampToValueAtTime(musicCutoff, 1/60);
        noiseLowPass.frequency.exponentialRampToValueAtTime(noiseCutoff, 1/60);
        noiseGain.gain.exponentialRampToValueAtTime(0.02 + (gravity / mass ** 2), 1/60);
    }
};
