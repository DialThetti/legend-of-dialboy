export class ClockService {
  private tick(f: () => void, frequency: number): void {
    setTimeout(() => {
      requestAnimationFrame(() => this.tick(f, frequency));
      f();
    }, frequency);
  }

  repeat(f: () => void, frequency: number = 1000 / 60) {
    this.tick(f, frequency);
  }
}
