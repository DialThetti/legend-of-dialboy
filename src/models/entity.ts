export interface Entity {
  name: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    height: number;
    width: number;
  };
  traits: {
    name: string;
    payload: any;
  }[];
}
