export interface Position {
  x: number;
  y: number;
}

export const stonePositions: Position[] = [
  { x: 49, y: 50 },
  { x: 55, y: 36 }
];

export const mummyStartingPosition: Position = {
  x: 50,
  y: 50
};

export const ghostPositions: Position[] = [
  { x: 57, y: 25 },
  { x: 55, y: 36 }
];

export const batPositions: Position[] = [
  { x: 49, y: 47 },
  { x: 52, y: 47 }
];

export const spikePositions: Position[] = [
  { x: 48, y: 47 },
  { x: 50, y: 48 }
];

export const chestPositions: Position[] = [{ x: 52, y: 47 }];

interface OrganPositions {
  heart: Position;
  lung: Position;
  brain: Position;
  stomach: Position;
}

export const organPositions: OrganPositions = {
  heart: {x: 34, y: 43},
  lung: {x: 23, y: 79},
  brain: {x: 54, y: 68},
  stomach: {x: 75, y: 25}
}

interface ItemPositions {
  slingshot: Position;
  torch: Position;
}

export const itemPositions: ItemPositions = {
  slingshot: {x: 52, y: 49},
  torch: {x: 52, y: 50}
}
