const audioCtx = new AudioContext();
const backgroundMusicElement = document.querySelector('audio');
const backgroundMusicNode = audioCtx.createMediaElementSource(backgroundMusicElement);
backgroundMusicElement.loop = true;

// create a sequence of white noise
const whiteNoiseBuffer = audioCtx.createBuffer(1, 2 * 44100, 44100);
whiteNoiseBuffer.copyToChannel(whiteNoiseBuffer.getChannelData(0).map(() => {
        return Math.random();
    }), 0
);
const whiteNoiseNode = audioCtx.createBufferSource();
whiteNoiseNode.buffer = whiteNoiseBuffer;
whiteNoiseNode.loop = true;


// create audio chain for noise
const noiseLowPass = audioCtx.createBiquadFilter();
noiseLowPass.type.value = 'lowpass';
noiseLowPass.frequency.value = 150;

const noiseGain = audioCtx.createGain();
noiseGain.gain.value = 0;

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


const updateSounds = () => {
    if(audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if(audioCtx.state !== 'suspended' && backgroundMusicElement.paused) {
        backgroundMusicElement.play();
    }
    
    if(!player.isAlive || gamePaused) {
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, 1);
        musicLowPass.frequency.exponentialRampToValueAtTime(100, 1);
    } else {
        // change sounds depending on gravity
        const gravity = player.getTotalGravitationalPull().sum;
        const mass = player.mass;
        const musicCutoff = 150 + (gravity / mass * 2) * 50000;
        const noiseCutoff = 150 + (gravity / mass) * 50000;
        musicLowPass.frequency.exponentialRampToValueAtTime(musicCutoff/*150 + (player.getTotalGravitationalPull().sum / (player.mass * 2)) * 50000*/, 1/60);
        noiseLowPass.frequency.exponentialRampToValueAtTime(noiseCutoff/*150 + (player.getTotalGravitationalPull().sum / player.mass) * 50000*/, 1/60);
        noiseGain.gain.exponentialRampToValueAtTime(0.001 + player.getTotalGravitationalPull().sum / player.mass, 1/60);
    }
};