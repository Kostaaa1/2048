import { useCallback, useState } from "react";
import usePrevious from "./usePrevious";
import { colors, GLOBAL } from "../utils/utils";

type Cell = {
  value: number;
  bgColor: string;
  textColor: string;
};

export default function useBoard() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const prevBoard = usePrevious<Cell[][]>(board);
  const [score, setScore] = useState<number>(0);

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
        return colors.cell[value];
      }
    };
    const cell = {
      value,
      bgColor: parseColor(),
      textColor: value >= 8 ? colors.bg : colors.value,
    };
    return cell;
  }

  function areBoardsSame(b1: Cell[][], b2: Cell[][]): boolean {
    return b1.every((row, rowId) =>
      row.every((col, colId) => col.value === b2[rowId][colId].value)
    );
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
        setScore((score) => n.value + score);
        [row[i], row[i - 1]] = [newCell(0), n];
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
          }
        }
      }
    };
    compress(true);
    merge();
    compress(true);
    return b;
  };

  const rewindMove = useCallback(() => {
    if (prevBoard) setBoard(prevBoard);
  }, [prevBoard]);

  return {
    createBoard,
    getRandEmptyCellIndices,
    areBoardsSame,
    newCell,
    moveDown,
    moveRight,
    moveLeft,
    moveUp,
    board,
    score,
    setBoard,
    rewindMove,
  };
}
