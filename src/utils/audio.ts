/**
 * Procedural ambient sound generator using the Web Audio API.
 * 100% client-side, zero external assets or network dependencies.
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: 'wind' | 'waves' | 'rain' | 'train' | 'bell') {
    if (this.currentType === type) {
      this.stop();
      return false; // toggled off
    }

    this.stop();
    this.initContext();
    if (!this.ctx) return false;

    this.currentType = type;

    switch (type) {
      case 'waves':
        this.startOceanWaves();
        break;
      case 'rain':
        this.startGentleRain();
        break;
      case 'wind':
        this.startAlpineWind();
        break;
      case 'train':
        this.startTrainRhythm();
        break;
      case 'bell':
        this.startTempleBell();
        break;
    }

    return true; // toggled on
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.currentType = null;
  }

  public getCurrentType(): string | null {
    return this.currentType;
  }

  // Pink noise generator for organic ambience
  private createNoiseNode(bufferSec = 5) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * bufferSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    return noise;
  }

  private startOceanWaves() {
    if (!this.ctx) return;
    const noise = this.createNoiseNode();
    if (!noise) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    // LFO for surge and recession of waves
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(280, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        noise.stop();
        lfo.stop();
        noise.disconnect();
        lfo.disconnect();
      },
    });
  }

  private startGentleRain() {
    if (!this.ctx) return;
    const noise = this.createNoiseNode();
    if (!noise) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.activeNodes.push({
      stop: () => {
        noise.stop();
        noise.disconnect();
      },
    });
  }

  private startAlpineWind() {
    if (!this.ctx) return;
    const noise = this.createNoiseNode();
    if (!noise) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        noise.stop();
        lfo.stop();
        noise.disconnect();
      },
    });
  }

  private startTrainRhythm() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    let timerId: number | null = null;
    let isRunning = true;

    const triggerClick = () => {
      if (!this.ctx || !isRunning) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    };

    let step = 0;
    const loop = () => {
      if (!isRunning) return;
      triggerClick();
      // click-clack train cadence
      const interval = step % 2 === 0 ? 180 : 320;
      step++;
      timerId = window.setTimeout(loop, interval);
    };

    loop();

    this.activeNodes.push({
      stop: () => {
        isRunning = false;
        if (timerId) clearTimeout(timerId);
      },
    });
  }

  private startTempleBell() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(329.63, t); // E4

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, t); // E5 overtone

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 6.0); // long ringing resonance

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 6.1);
    osc2.stop(t + 6.1);

    this.activeNodes.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
        } catch {
          // ignore
        }
      },
    });
  }
}

export const soundscape = new SoundscapeEngine();
