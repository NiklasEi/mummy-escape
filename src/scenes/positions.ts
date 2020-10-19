export interface Position {
  x: number;
  y: number;
}

export const stonePositions: Position[] = [
  { x: 52, y: 48 },
  { x: 55, y: 36 }
];

export const mummyStartingPosition: Position = {
  x: 50,
  y: 50
};

export const ghostPositions: Position[] = [
  { x: 57, y: 25 },
  { x: 54, y: 22 },
  { x: 73, y: 30 },
  { x: 72, y: 39 },
  { x: 75, y: 60 },
  { x: 56, y: 68 },
  { x: 48, y: 57 },
  { x: 22, y: 76 },
  { x: 59, y: 31 },
  { x: 55, y: 36 }
];

export const batPositions: Position[] = [
  { x: 22, y: 21 },
  { x: 29, y: 28 },
  { x: 78, y: 42 },
  { x: 59, y: 54 },
  { x: 58, y: 70 },
  { x: 48, y: 69 },
  { x: 42, y: 65 },
  { x: 42, y: 50 },
  { x: 44, y: 42 }
];

export const spikePositions: Position[] = [
  { x: 49, y: 41 },
  { x: 50, y: 43 },
  { x: 50, y: 39 }
];

export const chestPositions: Position[] = [{ x: 47, y: 52 }];

interface OrganPositions {
  heart: Position;
  lungs: Position;
  brain: Position;
  stomach: Position;
}

export const organPositions: OrganPositions = {
  heart: { x: 34, y: 43 },
  lung: { x: 23, y: 79 },
  brain: { x: 54, y: 68 },
  stomach: { x: 75, y: 25 }
  //   heart: { x: 48, y: 52 },
  //   lungs: { x: 49, y: 52 },
  //   brain: { x: 50, y: 52 },
  //   stomach: { x: 51, y: 52 }
};

interface ItemPositions {
  slingshot: Position;
  torch: Position;
}

export const itemPositions: ItemPositions = {
  slingshot: { x: 52, y: 49 },
  torch: { x: 52, y: 50 }
};
