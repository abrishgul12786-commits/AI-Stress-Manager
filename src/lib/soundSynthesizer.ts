// Web Audio API ambient relaxation sound generator and chime synthesizer

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private activeNodes: { [key: string]: { stop: () => void } } = {};
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public playChime(freq = 432, duration = 3) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    // Subtle harmonic warmth
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, this.ctx.currentTime);
    const gain2 = this.ctx.createGain();

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  public stopSound(key: string) {
    if (this.activeNodes[key]) {
      this.activeNodes[key].stop();
      delete this.activeNodes[key];
    }
  }

  public stopAll() {
    Object.keys(this.activeNodes).forEach((key) => {
      this.stopSound(key);
    });
  }

  public startOceanBreeze(key = 'ocean_breeze') {
    this.stopSound(key);
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Pink/White noise source filtered to simulate rolling waves
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    // LFO to modulate filter frequency for wave swell (approx every 8s)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8s cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.35, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.activeNodes[key] = {
      stop: () => {
        try {
          whiteNoise.stop();
          lfo.stop();
          whiteNoise.disconnect();
          lfo.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  public startRainMeditation(key = 'rain_meditation') {
    this.stopSound(key);
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.08; // scale down
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    rainSource.start();

    this.activeNodes[key] = {
      stop: () => {
        try {
          rainSource.stop();
          rainSource.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  public startDeepAlphaWaves(key = 'deep_alpha_waves') {
    this.stopSound(key);
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Binaural beat: 200 Hz in left, 210 Hz in right = 10 Hz Alpha state entrainment
    const merger = this.ctx.createChannelMerger(2);

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(200, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(210, this.ctx.currentTime);

    const gainLeft = this.ctx.createGain();
    gainLeft.gain.setValueAtTime(0.2, this.ctx.currentTime);
    const gainRight = this.ctx.createGain();
    gainRight.gain.setValueAtTime(0.2, this.ctx.currentTime);

    oscLeft.connect(gainLeft);
    gainLeft.connect(merger, 0, 0); // Left channel

    oscRight.connect(gainRight);
    gainRight.connect(merger, 0, 1); // Right channel

    // Soft warm pad drone under the binaural beat
    const droneOsc = this.ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(100, this.ctx.currentTime);
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);

    merger.connect(this.masterGain);

    oscLeft.start();
    oscRight.start();
    droneOsc.start();

    this.activeNodes[key] = {
      stop: () => {
        try {
          oscLeft.stop();
          oscRight.stop();
          droneOsc.stop();
          oscLeft.disconnect();
          oscRight.disconnect();
          droneOsc.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  public startCalmForest(key = 'calm_forest') {
    this.stopSound(key);
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Gentle wind pass with subtle high harmonic breeze
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    // LFO for swaying breeze
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);

    windSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    windSource.start();
    lfo.start();

    this.activeNodes[key] = {
      stop: () => {
        try {
          windSource.stop();
          lfo.stop();
          windSource.disconnect();
          lfo.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  public startGentleBrownNoise(key = 'gentle_brown_noise') {
    this.stopSound(key);
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // boost level
    }

    const brownSource = this.ctx.createBufferSource();
    brownSource.buffer = noiseBuffer;
    brownSource.loop = true;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);

    brownSource.connect(gainNode);
    gainNode.connect(this.masterGain);

    brownSource.start();

    this.activeNodes[key] = {
      stop: () => {
        try {
          brownSource.stop();
          brownSource.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }
}

export const soundSynthesizer = new SoundSynthesizer();
