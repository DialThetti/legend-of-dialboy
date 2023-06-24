export class ClockService {
  last?: number;
  private tick(f: (dT: number) => void, frequency: number): void {
    setTimeout(async () => {
      requestAnimationFrame(() =>
        this.tick(() => {
          const now = Date.now();
          if (!this.last) {
            this.last = now;
          }
          const dT = (now - this.last) / 1000;
          f(dT);
          this.last = now;
        }, frequency)
      );
      f(0);
    }, frequency);
  }

  repeat(f: (dT: number) => void, frequency: number = 1000 / 60) {
    this.tick(f, frequency);
  }
}
