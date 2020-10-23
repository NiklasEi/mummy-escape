export interface Position {
  x: number;
  y: number;
}

export const stonePositions: Position[] = [
  { x: 52, y: 48 },
  { x: 25, y: 22 },
  { x: 50, y: 25 },
  { x: 21, y: 28 },
  { x: 45, y: 44 },
  { x: 73, y: 31 },
  { x: 58, y: 37 },
  { x: 63, y: 51 },
  { x: 44, y: 47 },
  { x: 26, y: 52 },
  { x: 37, y: 75 },
  { x: 50, y: 74 },
  { x: 62, y: 44 },
  { x: 76, y: 53 },
  { x: 78, y: 78 },
  { x: 55, y: 36 },
  { x: 73, y: 35 },
  { x: 78, y: 58 }
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
  { x: 55, y: 36 },
  { x: 33, y: 65 },
  { x: 35, y: 42 }
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
  { x: 44, y: 42 },
  { x: 71, y: 53 },
  { x: 79, y: 73 },
  { x: 29, y: 57 },
  { x: 67, y: 22 },
  { x: 37, y: 77 }
];

export const spikePositions: Position[] = [
  { x: 49, y: 41 },
  { x: 50, y: 43 },
  { x: 50, y: 39 },
  { x: 30, y: 22 },
  { x: 28, y: 22 },
  { x: 79, y: 32 },
  { x: 78, y: 34 },
  { x: 67, y: 43 },
  { x: 69, y: 44 },
  { x: 68, y: 42 },
  { x: 71, y: 43 },
  { x: 34, y: 53 },
  { x: 46, y: 38 },
  { x: 31, y: 67 },
  { x: 61, y: 75 },
  { x: 50, y: 57 },
  { x: 50, y: 59 }
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
  lungs: { x: 23, y: 79 },
  brain: { x: 54, y: 68 },
  stomach: { x: 75, y: 25 }
};

interface ItemPositions {
  slingshot: Position;
  lamp: Position;
}

export const itemPositions: ItemPositions = {
  slingshot: { x: 60, y: 22 },
  lamp: { x: 21, y: 22 }
};

export const torchPositions: Position[] = [
  { x: 21, y: 31 },
  { x: 21, y: 34 },
  { x: 61, y: 22 },
  { x: 20, y: 22 }
];

interface ArrowTrap {
  trigger: Position;
  arrowStart: Position;
}

export const arrowTrapPositions: ArrowTrap[] = [
  {
    trigger: {
      x: 33,
      y: 58
    },
    arrowStart: {
      x: 20,
      y: 58
    }
  },
  {
    trigger: {
      x: 32,
      y: 57
    },
    arrowStart: {
      x: 20,
      y: 57
    }
  },
  {
    trigger: {
      x: 56,
      y: 32
    },
    arrowStart: {
      x: 65,
      y: 32
    }
  },
  {
    trigger: {
      x: 49,
      y: 42
    },
    arrowStart: {
      x: 49,
      y: 21
    }
  },
  {
    trigger: {
      x: 68,
      y: 26
    },
    arrowStart: {
      x: 76,
      y: 26
    }
  },
  {
    trigger: {
      x: 27,
      y: 72
    },
    arrowStart: {
      x: 27,
      y: 65
    }
  },
  {
    trigger: {
      x: 26,
      y: 72
    },
    arrowStart: {
      x: 26,
      y: 80
    }
  },
  {
    trigger: {
      x: 42,
      y: 32
    },
    arrowStart: {
      x: 31,
      y: 32
    }
  },
  {
    trigger: {
      x: 41,
      y: 31
    },
    arrowStart: {
      x: 47,
      y: 31
    }
  }
];
