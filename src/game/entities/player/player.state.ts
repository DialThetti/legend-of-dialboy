export interface PlayerState {
  step: number;
  direction: string;
  position: { x: number; y: number };
  presentItem?: {
    item: string;
    timer: number;
  };
}
