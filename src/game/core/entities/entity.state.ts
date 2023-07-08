export interface EntityState {
  position: {
    x: number;
    y: number;
    z: number;
  };
  velocity: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}
