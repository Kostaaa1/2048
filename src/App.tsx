import { useEffect, useState } from "react";

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
  },
};

const GLOBAL = {
  rows: 4,
  cols: 4,
};

type Cell = {
  value: number;
  bgColor: string;
  textColor: string;
};

const getRandEmptyCellIndices = (board: Cell[][]): { row: number; col: number } => {
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
};

const newCell = (value: number): Cell => {
  const cell = {
    value,
    bgColor: value >= 32 ? colors.cell[32] : colors.cell[value],
    textColor: value >= 8 ? colors.bg : colors.value,
  };
  return cell;
};

const initBoard = () => {
  const emptyBoard: Cell[][] = Array.from({ length: GLOBAL.rows }, () =>
    Array.from({ length: GLOBAL.cols }, () => newCell(0))
  );

  const rand = getRandEmptyCellIndices(emptyBoard);
  emptyBoard[rand.row][rand.col] = newCell(2);
  const rand2 = getRandEmptyCellIndices(emptyBoard);
  emptyBoard[rand2.row][rand2.col] = newCell(2);
  return emptyBoard;
};

function App() {
  const [board, setBoard] = useState<Cell[][]>(initBoard);
  const [score, setScore] = useState<number>(0);
  const sumRow = (row: Cell[], direction: "left" | "right") => {
    for (let i = row.length - 1; i > 0; i--) {
      if (row[i].value !== 0 && row[i].value === row[i - 1].value) {
        const n = newCell(row[i].value * 2);
        setScore((score) => score + n.value);
        const toReplace = direction === "right" ? [n, newCell(0)] : [newCell(0), n];
        [row[i], row[i - 1]] = toReplace;
      }
    }
  };

  const moveRight = (row: Cell[]): Cell[] => {
    let conditionRunCount = 0;
    sumRow(row, "right");
    for (let i = row.length - 1; i > 0; i--) {
      if (row[i].value === 0 && row[i - 1].value !== 0) {
        if (row[i].value !== 0) {
          conditionRunCount++;
        }
        [row[i], row[i - 1]] = [row[i - 1], row[i]];
        if (i < row.length - 1) i += 2;
      }
    }
    if (conditionRunCount >= 2) {
      sumRow(row, "right");
    }
    return row;
  };

  const moveLeft = (row: Cell[]): Cell[] => {
    let conditionRunCount = 0;
    sumRow(row, "left");

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i].value === 0 && row[i + 1].value !== 0) {
        if (row[i].value !== 0) {
          conditionRunCount++;
        }
        [row[i], row[i + 1]] = [row[i + 1], row[i]];
        if (i >= 1) i -= 2;
      }
    }
    if (conditionRunCount >= 2) {
      sumRow(row, "left");
    }
    return row;
  };

  const sumCellCol = (b: Cell[][], direction: "up" | "down") => {
    for (let i = 0; i < GLOBAL.rows - 1; i++) {
      for (let k = 0; k < GLOBAL.cols; k++) {
        if (b[i][k].value !== 0 && b[i][k].value === b[i + 1][k].value) {
          const n = newCell(b[i][k].value * 2);
          setScore((score) => score + n.value);
          const newOrder = direction === "up" ? [n, newCell(0)] : [newCell(0), n];
          [b[i][k], b[i + 1][k]] = newOrder;
        }
      }
    }
  };

  const moveUp = (board: Cell[][]): Cell[][] => {
    // let conditionRunCount = 0;
    const b = board.map((x) => x.slice());
    sumCellCol(b, "up");

    for (let i = GLOBAL.rows - 1; i > 0; i--) {
      for (let k = GLOBAL.cols - 1; k >= 0; k--) {
        if (b[i][k].value !== 0 && b[i - 1][k].value === 0) {
          console.log("RUNN");
          // conditionRunCount++;
          [b[i][k], b[i - 1][k]] = [b[i - 1][k], b[i][k]];
          if (i < GLOBAL.rows - 1) i += 2;
        }
      }
    }
    // if (conditionRunCount >= 2) {
    //   sumCellCol(b, "up");
    // }
    return b;
  };

  const sumCells = (b: Cell[][]) => {
    for (let i = GLOBAL.rows - 1; i > 0; i--) {
      for (let k = GLOBAL.cols - 1; k >= 0; k--) {
        if (b[i][k].value !== 0 && b[i][k].value === b[i - 1][k].value) {
          const n = newCell(b[i][k].value * 2);
          setScore((score) => score + n.value);
          [b[i][k], b[i - 1][k]] = [newCell(n.value), newCell(0)];
        }
      }
    }
    return b;
  };

  const moveDown = (board: Cell[][]): Cell[][] => {
    let conditionRunCount = 0;
    const b = board.map((x) => x.slice());
    sumCells(b);

    for (let i = 0; i < GLOBAL.rows - 1; i++) {
      for (let k = 0; k < GLOBAL.cols; k++) {
        if (b[i][k].value !== 0 && b[i + 1][k].value == 0) {
          console.log("RUNJJ");
          conditionRunCount++;
          [b[i][k], b[i + 1][k]] = [b[i + 1][k], b[i][k]];
          if (i >= 1) i -= 2;
        }
      }
    }
    if (conditionRunCount >= 2) {
      sumCells(b);
    }
    return b;
  };

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      const arrows = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
      const { key } = e;
      if (!arrows.includes(key)) return;

      switch (key) {
        case arrows[0]: {
          setBoard((board) => board.map((row) => moveRight(row)));
          break;
        }
        case arrows[1]: {
          setBoard((board) => board.map((row) => moveLeft(row)));
          break;
        }
        case arrows[2]: {
          setBoard(moveUp);
          break;
        }
        case arrows[3]: {
          setBoard(moveDown);
          break;
        }
      }

      // const { row, col } = getRandEmptyCellIndices(board);
      // const copy = board.map((row) => row.slice());
      // copy[row][col] = newCell(2);
      // setBoard(copy);
    };

    document.addEventListener("keydown", eventHandler);
    return () => {
      document.removeEventListener("keydown", eventHandler);
    };
  }, [board]);

  return (
    <>
      <h1 className="w-full text-5xl text-end font-semibold text-[#786E65]">{score}</h1>
      <div
        className={
          "w-[520px] h-[520px] flex-col flex border-8 border-[${colors.border}] items-center justify-center"
        }
        style={{
          borderColor: colors.border,
        }}
      >
        {board.map((row, rowId) => (
          <div key={rowId} className="flex h-full w-full">
            {row.map((cell, cellId) => (
              <div
                key={cellId}
                className={
                  "h-full w-full border-8 inline-flex items-center justify-center font-extrabold text-5xl"
                }
                style={{
                  background: cell.bgColor,
                  color: cell.textColor,
                  borderColor: colors.border,
                }}
              >
                {cell.value == 0 ? "" : cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
