import { useEffect } from "react";
import useBoard from "./hook/useBoard";
import { colors } from "./utils/utils";

function App() {
  const {
    areBoardsSame,
    getRandEmptyCellIndices,
    newCell,
    board,
    moveDown,
    moveLeft,
    moveRight,
    moveUp,
    score,
    rewindMove,
    setBoard,
  } = useBoard();

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      const arrows = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
      const { key } = e;
      if (!arrows.includes(key)) return;
      let copyBoard = board.map((row) => row.slice());

      switch (key) {
        case arrows[0]: {
          copyBoard = copyBoard.map((row) => moveRight(row));
          break;
        }
        case arrows[1]: {
          copyBoard = copyBoard.map((row) => moveLeft(row));
          break;
        }
        case arrows[2]: {
          copyBoard = moveUp(copyBoard);
          break;
        }
        case arrows[3]: {
          copyBoard = moveDown(copyBoard);
          break;
        }
      }

      if (!areBoardsSame(copyBoard, board)) {
        const { row, col } = getRandEmptyCellIndices(copyBoard);
        copyBoard[row][col] = newCell(2);
        const el = document.getElementById(`cell-${row}-${col}`) as HTMLDivElement;
        if (el) {
          el.classList.add("animate-appear");
          setTimeout(() => {
            el.classList.remove("animate-appear");
          }, 200);
        }
      }
      setBoard(copyBoard);
    };

    document.addEventListener("keydown", eventHandler);
    return () => {
      document.removeEventListener("keydown", eventHandler);
    };
  }, [board]);

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <button
          onClick={rewindMove}
          className="text-white rounded-lg h-8 px-2 duration-200 bg-[#BBADA0]"
        >
          Previous move
        </button>
        <h1 className=" text-5xl text-end font-semibold text-[#786E65]">{score}</h1>
      </div>
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
            {row.map((col, colId) => (
              <div
                key={colId}
                className={"h-full w-full border-8 font-extrabold text-5xl bg-[#CDC1B4]"}
                style={{
                  color: col.textColor,
                  borderColor: colors.border,
                }}
              >
                <div
                  id={`cell-${rowId}-${colId}`}
                  className="inline-flex items-center justify-center w-full h-full"
                  style={{
                    background: col.bgColor,
                  }}
                >
                  {col.value == 0 ? "" : col.value}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
