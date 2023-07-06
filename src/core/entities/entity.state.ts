export interface EntityState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}
