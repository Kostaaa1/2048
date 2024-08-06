export type Cell = {
  value: number;
  bgColor: string;
  textColor: string;
};

const colors = {
  bg: "#F9F8EF",
  value: "#786E65",
  border: "#BBADA0",
  cell: {
    0: "#CDC1B4",
    2: "#eee4da",
    4: "#ede1c9",
    8: "#F3B27A",
    16: "#f69664",
    32: "#f77c5f",
    128: "#eec53f",
  },
};

const GLOBAL = {
  rows: 4,
  cols: 4,
  finalScore: 2048,
};

function getRandEmptyCellIndices(board: Cell[][]): { row: number; col: number } {
  const emptyCells: { row: number; col: number }[] = [];
  for (let i = 0; i < GLOBAL.rows; i++) {
    for (let j = 0; j < GLOBAL.cols; j++) {
      if (board[i][j].value === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  const rand = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[rand];
}

function newCell(value: number): Cell {
  const parseColor = () => {
    if (value >= 128) {
      return colors.cell[128];
    } else if (value >= 32) {
      return colors.cell[32];
    } else {
      return colors.cell[value as keyof typeof colors.cell];
    }
  };
  const cell = {
    value,
    bgColor: parseColor(),
    textColor: value >= 8 ? colors.bg : colors.value,
  };
  return cell;
}

function createBoard() {
  const emptyBoard: Cell[][] = Array.from({ length: GLOBAL.rows }, () =>
    Array.from({ length: GLOBAL.cols }, () => newCell(0))
  );

  const rand = getRandEmptyCellIndices(emptyBoard);
  emptyBoard[rand.row][rand.col] = newCell(2);
  const rand2 = getRandEmptyCellIndices(emptyBoard);
  emptyBoard[rand2.row][rand2.col] = newCell(2);

  return emptyBoard;
}

export { createBoard, newCell, getRandEmptyCellIndices, GLOBAL, colors };
