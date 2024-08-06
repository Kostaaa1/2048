import { useState } from "react";
import usePrevious from "./usePrevious";
import { Cell, createBoard, GLOBAL, newCell } from "../utils/utils";

export default function useBoard() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const prevBoard = usePrevious<Cell[][]>(board);
  const [score, setScore] = useState<number>(0);

  const areBoardsSame = (b1: Cell[][], b2: Cell[][]) => {
    return b1.every((row, rowId) =>
      row.every((col, colId) => {
        return col.value === b2[rowId][colId].value;
      })
    );
  };

  const moveLeft = (row: Cell[]): Cell[] => {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i].value === 0 && row[i + 1].value !== 0) {
        [row[i], row[i + 1]] = [row[i + 1], row[i]];
        if (i >= 1) i -= 2;
      }
    }
    for (let i = 0; i < row.length; i++) {
      if (i > 0 && row[i].value === row[i - 1].value) {
        const n = newCell(row[i].value * 2);
        setScore((score) => score + n.value);
        [row[i], row[i - 1]] = [newCell(0), n];
        isValue2048(n.value);
      }
    }
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i].value === 0 && row[i + 1].value !== 0) {
        [row[i], row[i + 1]] = [row[i + 1], row[i]];
        if (i >= 1) i -= 2;
      }
    }
    return row;
  };

  const moveRight = (row: Cell[]): Cell[] => {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i].value !== 0 && row[i + 1].value === 0) {
        [row[i], row[i + 1]] = [row[i + 1], row[i]];
        if (i >= 1) i -= 2;
        // i = -1;
      }
    }
    for (let i = row.length - 1; i > 0; i--) {
      if (row[i].value === 0 && row[i - 1].value !== 0) {
        [row[i], row[i - 1]] = [row[i - 1], row[i]];
      }
      if (row[i].value !== 0 && row[i].value === row[i - 1].value) {
        const n = newCell(row[i].value * 2);
        setScore((score) => score + n.value);
        [row[i], row[i - 1]] = [n, newCell(0)];
        isValue2048(n.value);
      }
    }
    return row;
  };

  const moveUp = (b: Cell[][]): Cell[][] => {
    const compress = () => {
      for (let i = 0; i < GLOBAL.rows - 1; i++) {
        for (let k = 0; k < GLOBAL.cols; k++) {
          if (b[i][k].value === 0 && b[i + 1][k].value !== 0) {
            [b[i][k], b[i + 1][k]] = [b[i + 1][k], b[i][k]];
            if (i > 1) i -= 2;
          }
        }
      }
    };
    const merge = () => {
      for (let i = 0; i < GLOBAL.rows - 1; i++) {
        for (let k = 0; k < GLOBAL.cols; k++) {
          if (b[i][k].value !== 0 && b[i][k].value === b[i + 1][k].value) {
            const n = newCell(b[i][k].value * 2);
            setScore((score) => score + n.value);
            [b[i][k], b[i + 1][k]] = [n, newCell(0)];
            isValue2048(n.value);
          }
        }
      }
    };
    compress();
    merge();
    compress();
    return b;
  };

  const moveDown = (b: Cell[][]) => {
    const compress = (withBacktrack: boolean = false) => {
      for (let i = GLOBAL.rows - 1; i > 0; i--) {
        for (let k = GLOBAL.cols - 1; k >= 0; k--) {
          if (b[i][k].value === 0 && b[i - 1][k].value !== 0) {
            [b[i][k], b[i - 1][k]] = [b[i - 1][k], b[i][k]];
            if (withBacktrack && i < GLOBAL.cols - 1) {
              i += 1;
              k += 1;
            }
          }
        }
      }
    };
    const merge = () => {
      for (let i = GLOBAL.rows - 1; i > 0; i--) {
        for (let k = GLOBAL.cols - 1; k >= 0; k--) {
          if (b[i][k].value === b[i - 1][k].value) {
            const n = newCell(b[i][k].value * 2);
            setScore((score) => score + n.value);
            [b[i][k], b[i - 1][k]] = [n, newCell(0)];
            isValue2048(n.value);
          }
        }
      }
    };
    compress(true);
    merge();
    compress(true);
    return b;
  };

  const isValue2048 = (value: number) => {
    setTimeout(() => {
      if (value === GLOBAL.finalScore) alert("You won the game !!!");
    }, 0);
  };

  return {
    prevBoard,
    // createBoard,
    // getRandEmptyCellIndices,
    // newCell,
    areBoardsSame,
    moveDown,
    moveRight,
    moveLeft,
    moveUp,
    board,
    score,
    setBoard,
  };
}
