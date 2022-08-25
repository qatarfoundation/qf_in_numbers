import { gsap } from 'gsap';

import sound from '@/assets/sounds/music.mp3';

class SoundManager {
    constructor() {
        this.initialized = false;
        this.tl = null;
    }

    async init() {
        this.initialized = true;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0;
        this.gain.connect(this.ctx.destination);

        this.buffer = await fetch(sound)
            .then(res => res.arrayBuffer())
            .then(buffer => this.ctx.decodeAudioData(buffer));

        this.source = this.ctx.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gain);
        this.source.loop = true;
        this.source.start();
    }

    async play() {
        if (!this.initialized) await this.init();
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline();
        this.tl.to(this.gain.gain, { value: 1, duration: 3 });
    }

    pause() {
        if (!this.gain) return;
        if (this.tl) this.tl.kill();
        this.tl = gsap.timeline();
        this.tl.to(this.gain.gain, { value: 0, duration: 1 });
    }

    setMasterVolume(volume) {
        this.gain.gain.value = volume;
    }

    setVolume(value) {
        this.gain.gain.setValueAtTime(value, this.ctx.currentTime);
    }
}

export default new SoundManager();
