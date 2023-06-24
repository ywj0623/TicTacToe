/* eslint-disable react/prop-types */
import React from 'react'
import { useReducer, useEffect, useCallback } from 'react'
import Board from './Board'

const weightingList = {
  '0, 0': 0,
  '0, 1': 0,
  '0, 2': 0,
  '1, 0': 0,
  '1, 1': 0,
  '1, 2': 0,
  '2, 0': 0,
  '2, 1': 0,
  '2, 2': 0,
}

const lines = [
  // 以下為完成連線的座標， [x, y] x 代表 row, y 代表 column
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
]

// const GameInfos = (props) => {
//   if (props.aiIsPreEmptive === undefined) {
//     return (
//       <input
//         className="text-white mt-4"
//         type="button"
//         value="開始遊戲"
//         onClick={() => {
//           props?.onChange({
//             aiIsPreEmptive: choosePreEmptive(),
//           })
//         }}
//       />
//     )
//   }

//   // return (
//   //   <div className="">
//   //     <div>你是{props.aiIsPreEmptive ? '後攻：O' : '先攻：X'}</div>
//   //     {props.winner ? (
//   //       <>
//   //         <div>贏家是 {props.winner}</div>
//   //         <input
//   //           type="button"
//   //           value="再玩一局"
//   //           onClick={() => {
//   //             console.log('再玩一局')
//   //           }}
//   //         />
//   //       </>
//   //     ) : (
//   //       <>
//   //         <div>目前： {props.oIsNext ? 'X' : 'O'}</div>
//   //         {props.stepNumber !== 9 ? (
//   //           <div>下一位： {props.oIsNext ? 'O' : 'X'}</div>
//   //         ) : (
//   //           <>
//   //             <div>和局</div>
//   //             <input
//   //               type="button"
//   //               value="再玩一局"
//   //               onClick={() => {
//   //                 console.log('再玩一局')
//   //               }}
//   //             />
//   //           </>
//   //         )}
//   //       </>
//   //     )}
//   //   </div>
//   // )
// }

function choosePreEmptive() {
  const randomNum = Math.random() * 100

  if (randomNum < 50) {
    return true
  }

  return false
}

function genRandomPosition(targetArray = null) {
  const randomNum = Math.floor(Math.random() * 10)
  const condition = targetArray
    ? targetArray.includes(randomNum)
    : 0 <= randomNum && randomNum !== 9

  if (condition) {
    const row = Math.floor(randomNum / 3)
    const column = randomNum % 3
    return { row, column }
  }

  return targetArray ? genRandomPosition(targetArray) : genRandomPosition()
}

function setSpecificPositionWeight(gameInfos, weightingList) {
  const squares = gameInfos.squares
  const specificPosition = [
    [0, 0], // 0
    [0, 2], // 1
    [1, 1], // 2
    [2, 0], // 3
    [2, 2], // 4
  ]

  for (let i = 0; i < specificPosition.length; i++) {
    const [a, b] = specificPosition[i]

    if (squares[a][b] === null) {
      weightingList[`${a}, ${b}`] += 5
    }
  }

  return weightingList
}

function checkOpponentSurroundingEmpty(gameInfos, weightingList) {
  const squares = gameInfos.squares

  for (let i = 0; i < gameInfos.positionList.length; i++) {
    const [a, b] = gameInfos.positionList[i]

    if (squares[a][b] === gameInfos.roles.Player) {
      for (let i = a - 1; i <= a + 1; i++) {
        for (let j = b - 1; j <= b + 1; j++) {
          if (i >= 0 && j >= 0 && i < 3 && j < 3 && !(i === a && j === b)) {
            weightingList[`${i}, ${j}`] += 3
          }
        }
      }
    }
  }

  for (let i = 0; i < gameInfos.positionList.length; i++) {
    const [a, b] = gameInfos.positionList[i]

    if (squares[a][b] === gameInfos.roles.Player) {
      weightingList[`${a}, ${b}`] = 0
    } else if (squares[a][b] === gameInfos.roles.AI) {
      weightingList[`${a}, ${b}`] = 0
    }
  }

  // console.log(weightingList)
  return weightingList
}

function checkOccupied(gameInfos, weightingList, occupiedSpace, weights) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    const [x1, y1] = a
    const [x2, y2] = b
    const [x3, y3] = c
    const Player = gameInfos.aiIsPreEmptive ? 'O' : 'X'
    const NPC = gameInfos.aiIsPreEmptive ? 'X' : 'O'

    const [playerOccupied1, playerOccupied2, playerOccupied3] = [
      gameInfos.squares[x1][y1] === Player,
      gameInfos.squares[x2][y2] === Player,
      gameInfos.squares[x3][y3] === Player,
    ]
    const [npcOccupied1, npcOccupied2, npcOccupied3] = [
      gameInfos.squares[x1][y1] === NPC,
      gameInfos.squares[x2][y2] === NPC,
      gameInfos.squares[x3][y3] === NPC,
    ]
    const emptySpace = lines[i].filter((node) => node === null).length === 2

    const conditions = [
      (playerOccupied1 && emptySpace) ||
        (playerOccupied2 && emptySpace) ||
        (playerOccupied3 && emptySpace),
      (npcOccupied1 && emptySpace) ||
        (npcOccupied2 && emptySpace) ||
        (npcOccupied3 && emptySpace),
      (playerOccupied1 && playerOccupied2) ||
        (playerOccupied1 && playerOccupied3) ||
        (playerOccupied2 && playerOccupied3),
      (npcOccupied1 && npcOccupied2) ||
        (npcOccupied1 && npcOccupied3) ||
        (npcOccupied2 && npcOccupied3),
    ]

    if (
      (occupiedSpace === 1 && conditions[0]) ||
      (occupiedSpace === 2 && conditions[2])
    ) {
      weightingList[`${x1}, ${y1}`] =
        gameInfos.squares[x1][y1] === null ? +weights[0] : +0
      weightingList[`${x2}, ${y2}`] =
        gameInfos.squares[x2][y2] === null ? +weights[0] : +0
      weightingList[`${x3}, ${y3}`] =
        gameInfos.squares[x3][y3] === null ? +weights[0] : +0
    }

    if (
      (occupiedSpace === 1 && conditions[1]) ||
      (occupiedSpace === 2 && conditions[3])
    ) {
      weightingList[`${x1}, ${y1}`] =
        gameInfos.squares[x1][y1] === null ? +weights[1] : +0
      weightingList[`${x2}, ${y2}`] =
        gameInfos.squares[x2][y2] === null ? +weights[1] : +0
      weightingList[`${x3}, ${y3}`] =
        gameInfos.squares[x3][y3] === null ? +weights[1] : +0
    }
  }

  console.log('checkOccupied', weightingList)
  return weightingList
}

function check1OccupiedAnd2Empty(gameInfos, weightingList) {
  return checkOccupied(gameInfos, weightingList, 1, [15, 10])
}

function check2Occupied1Empty(gameInfos, weightingList) {
  return checkOccupied(gameInfos, weightingList, 2, [50, 100])
}

function generatePosition(gameInfos, weightingList) {
  setSpecificPositionWeight(gameInfos, weightingList)
  checkOpponentSurroundingEmpty(gameInfos, weightingList)
  check1OccupiedAnd2Empty(gameInfos, weightingList)
  check2Occupied1Empty(gameInfos, weightingList)

  const maxValue = Object.values(weightingList).sort((a, b) => b - a)[0]
  const maxValueAmount = Object.values(weightingList).filter(
    (node) => node === maxValue,
  )
  const list = Object.values(weightingList)
  let result
  let indices = []
  let target = list.indexOf(maxValue)

  if (maxValueAmount.length > 1) {
    while (target !== -1) {
      indices.push(target)
      target = list.indexOf(maxValue, target + 1)
    }

    result = genRandomPosition(indices)
  } else {
    indices.push(target)
    result = genRandomPosition(indices)
  }

  return result
}

function checkWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    const [x1, y1] = a
    const [x2, y2] = b
    const [x3, y3] = c

    if (
      squares[x1][y1] &&
      squares[x1][y1] === squares[x2][y2] &&
      squares[x1][y1] === squares[x3][y3]
    ) {
      return squares[x1][y1]
    }
  }

  return null
}

export default function Game() {
  const [state, dispatch] = useReducer(stateReducer, {
    aiIsPreEmptive: undefined,
    roles: {
      Player: undefined,
      AI: undefined,
    },
    stepNumber: 0,
    oIsNext: true,
    winner: null,
    positionList: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    squares: Array.from({ length: 3 }, () => Array(3).fill(null)),
    // squares: Array(3).fill(null).map(() => Array(3).fill(null))
  })

  const updateSquares = useCallback(
    (row, column) => {
      const squares = state.squares.slice()

      if (checkWinner(state?.squares) || state?.squares[row][column]) {
        return
      }

      squares[row][column] = state.oIsNext ? 'X' : 'O'
      return squares
    },
    [state.squares, state.oIsNext],
  )

  function stateReducer(state, action) {
    switch (action.type) {
      case 'aiIsPreEmptive_True':
        return { ...state, aiIsPreEmptive: true }
      case 'aiIsPreEmptive_False':
        return { ...state, aiIsPreEmptive: false }
      case 'AI_O':
        return { ...state, roles: { AI: 'O', Player: 'X' } }
      case 'AI_X':
        return { ...state, roles: { AI: 'X', Player: 'O' } }
      case 'updatedSquares':
        return { ...state, squares: action.payload }
      case 'accumulateStepNumber':
        return { ...state, stepNumber: state.stepNumber + 1 }
      case 'toggleOIsNext':
        return { ...state, oIsNext: !state.oIsNext }
      case 'updateWinner':
        return { ...state, winner: checkWinner(state.squares) }
      default:
        throw new Error()
    }
  }

  function handleFirstMove(aiIsPreEmptive) {
    if (aiIsPreEmptive) {
      dispatch({ type: 'aiIsPreEmptive_True' })
      const result = genRandomPosition()
      updateGameState(result.row, result.column)
      return
    }

    dispatch({ type: 'aiIsPreEmptive_False' })
    return
  }

  function updateGameState(row, column) {
    const updatedSquares = updateSquares(row, column)
    if (updatedSquares) {
      dispatch({
        type: 'updatedSquares',
        payload: updatedSquares,
      })
      dispatch({ type: 'accumulateStepNumber' })
      dispatch({ type: 'toggleOIsNext' })
      return
    }

    return console.log('generatePosition function crush')
  }

  useEffect(() => {
    if (state.aiIsPreEmptive === true) {
      dispatch({ type: 'AI_X' })
    } else if (state.aiIsPreEmptive === false) {
      dispatch({ type: 'AI_O' })
    }

    if (state.roles.AI === 'O' && !state.oIsNext) {
      const result = generatePosition(state, weightingList)
      updateGameState(result.row, result.column)
    } else if (state.roles.AI === 'X' && state.oIsNext) {
      const result = generatePosition(state, weightingList)
      updateGameState(result.row, result.column)
    }

    dispatch({ type: 'updateWinner' })
  }, [state.aiIsPreEmptive, updateSquares])

  return (
    <div className="min-h-screen container mx-auto flex flex-col items-middle justify-center">
      {/* {console.log(state.squares)} */}
      <Board
        aiIsPreEmptive={state.aiIsPreEmptive}
        squares={state.squares}
        onClick={(row, column) => {
          updateGameState(row, column)
        }}
      />

      <div
        className="bg-white/10 mx-auto mt-24 relative"
        style={{ borderRadius: '40px' }}
      >
        <div
          className={`flex flex-row gap-x-8 flex-nowrap px-10 py-6 items-start ${
            state.aiIsPreEmptive === undefined ||
            (state?.winner === null && state?.stepNumber === 9)
              ? 'opacity-20'
              : ''
          }`}
        >
          <div className="flex flex-col gap-y-2">
            <div
              className="w-20 h-20 rounded-full flex justify-center items-center"
              style={{
                backgroundColor:
                  (state?.aiIsPreEmptive !== undefined &&
                    state?.aiIsPreEmptive &&
                    state?.oIsNext) ||
                  (state?.aiIsPreEmptive !== undefined &&
                    !state?.aiIsPreEmptive &&
                    !state?.oIsNext)
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {state.roles?.AI === undefined ? (
                <></>
              ) : (
                <img
                  className="w-8"
                  src={`/images/${
                    state.roles?.AI === 'X' ? 'x' : 'o'
                  }_white.svg`}
                />
              )}
            </div>
            <div className="text-white/70 text-center">A.I</div>
            <div className="text-white/30 text-center text-sm">Player 2</div>
          </div>

          <div className="flex justify-center items-center h-20">
            <div className="text-5xl text-white tracking-widest">0:0</div>
          </div>

          <div className="flex flex-col gap-y-2">
            <div
              className="w-20 h-20 rounded-full flex justify-center items-center"
              style={{
                backgroundColor:
                  (state?.aiIsPreEmptive !== undefined &&
                    state?.aiIsPreEmptive &&
                    !state?.oIsNext) ||
                  (state?.aiIsPreEmptive !== undefined &&
                    !state?.aiIsPreEmptive &&
                    state?.oIsNext)
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              {state.roles?.Player === undefined ? (
                <></>
              ) : (
                <img
                  className="w-10"
                  src={`/images/${
                    state.roles?.Player === 'X' ? 'x' : 'o'
                  }_white.svg`}
                />
              )}
            </div>
            <div className="text-white/70 text-center">You</div>
            <div className="text-white/30 text-center text-sm">Player 1</div>
          </div>
        </div>

        {state?.aiIsPreEmptive === undefined ||
        (state?.winner === null && state?.stepNumber === 9) ? (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 flex justify-center items-center"
            style={{ borderRadius: '40px' }}
          >
            <input
              className="text-white mt-4 text-3xl w-full h-full"
              type="button"
              value={`${
                state.aiIsPreEmptive === undefined ? 'Start' : 'Play Again'
              }`}
              onClick={() => {
                const aiIsPreEmptive = choosePreEmptive()
                handleFirstMove(aiIsPreEmptive)
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* <GameInfos
        aiIsPreEmptive={state.aiIsPreEmptive}
        oIsNext={state.oIsNext}
        stepNumber={state.stepNumber}
        winner={state.winner}
        onChange={(e) => {
          handleFirstMove(e)
        }}
      /> */}
    </div>
  )
}
