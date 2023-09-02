import {
  React,
  lazy,
  Suspense,
  useReducer,
  useEffect,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'

const Square = lazy(() => import('.//Square'))

const positionList = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
]

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

  for (let i = 0; i < positionList.length; i++) {
    const [a, b] = positionList[i]

    if (squares[a][b] === gameInfos.playerRole) {
      for (let i = a - 1; i <= a + 1; i++) {
        for (let j = b - 1; j <= b + 1; j++) {
          if (i >= 0 && j >= 0 && i < 3 && j < 3 && !(i === a && j === b)) {
            weightingList[`${i}, ${j}`] += 3
          }
        }
      }
    }
  }

  for (let i = 0; i < positionList.length; i++) {
    const [a, b] = positionList[i]

    if (squares[a][b] === gameInfos.playerRole) {
      weightingList[`${a}, ${b}`] = 0
    }
    else if (squares[a][b] === gameInfos.aiRole) {
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
    (node) => node === maxValue
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
  }
  else {
    indices.push(target)
    result = genRandomPosition(indices)
  }

  return result
}

export default function Chessboard(props) {
  const initState = {
    aiRole: undefined,
    playerRole: undefined,
    stepNumber: 0,
    oIsNext: true,
    winner: null,
    squares: Array.from({ length: 3 }, () => Array(3).fill(null)),
    // squares: Array(3).fill(null).map(() => Array(3).fill(null))
  }

  const [state, dispatch] = useReducer(stateReducer, initState)

  const renderSquare = (row, column) => {
    return (
      <Suspense fallback={<div>Loading...</div>} key={row * 3 + column}>
        <Square
          isPlaying={props.isPlaying}
          value={state.squares[row][column]}
          onClick={() => {
            updateGameState(row, column)
          }}/>
      </Suspense>
    )
  }

  function stateReducer(state, action) {
    switch (action.type) {
    case 'aiRole':
      return { ...state, aiRole: action.payload }
    case 'playerRole':
      return { ...state, playerRole: action.payload }
    case 'updatedSquares':
      return { ...state, squares: action.payload }
    case 'accumulateStepNumber':
      return { ...state, stepNumber: state.stepNumber + 1 }
    case 'toggleOIsNext':
      return { ...state, oIsNext: !state.oIsNext }
    case 'updateWinner':
      return { ...state, winner: checkWinner(state.squares) }
    case 'reset':
      return { ...initState }
    default:
      throw new Error()
    }
  }

  function choosePreEmptive() {
    const randomNum = Math.random() * 100

    if (randomNum < 50) {
      return true
    }

    return false
  }

  function handleAiMove() {
    const result =
      state.stepNumber === 0
        ? genRandomPosition()
        : generatePosition(state, weightingList)

    updateGameState(result.row, result.column)
    return
  }

  const updateSquares = useCallback(
    (row, column) => {
      const squares = state.squares.slice()

      if (checkWinner(state?.squares) || state?.squares[row][column]) {
        return
      }

      squares[row][column] = state.oIsNext ? 'X' : 'O'
      return squares
    },
    [state.squares, state.oIsNext]
  )

  function updateGameState(row, column) {
    const updatedSquares = updateSquares(row, column)

    if (!updatedSquares) {
      return console.log('generatePosition function crush')
    }

    dispatch({
      type: 'updatedSquares',
      payload: updatedSquares,
    })
    dispatch({ type: 'accumulateStepNumber' })
    dispatch({ type: 'toggleOIsNext' })
    return
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

  useEffect(() => {
    if (props.isPlaying === true) {
      dispatch({ type: 'reset' })
      const aiIsPreEmptive = choosePreEmptive()

      dispatch({
        type: 'aiRole',
        payload: aiIsPreEmptive ? 'X' : 'O',
      })
      dispatch({
        type: 'playerRole',
        payload: aiIsPreEmptive ? 'O' : 'X',
      })

      props.onStart({
        aiRole: aiIsPreEmptive ? 'X' : 'O',
        playerRole: aiIsPreEmptive ? 'O' : 'X',
      })
    }
  }, [props.isPlaying])

  useEffect(() => {
    if (
      (state.aiRole === 'X' && state.stepNumber === 0) ||
      (state.aiRole === 'X' && state.oIsNext && state.stepNumber !== 9) ||
      (state.aiRole === 'O' && !state.oIsNext && state.stepNumber !== 9)
    ) {
      handleAiMove()
    }

    return
  }, [state.aiRole, state.stepNumber, state.oIsNext])

  useEffect(() => {
    dispatch({ type: 'updateWinner' })
  }, [updateSquares])

  useEffect(() => {
    switch (state.winner) {
    case 'X':
    case 'O':
      props.onEnd({ gameResult: state.winner })
      return

    case null:
      state.stepNumber === 9 ? props.onEnd({ gameResult: 'tiedGame' }) : null
      return
    }
  }, [state.winner, state.stepNumber])

  return (
    <div className="flex flex-col flex-wrap gap-y-5">
      {[0, 1, 2].map((node, idx) => {
        return (
          <div className="flex flex-row gap-x-5 mx-auto" key={idx}>
            {[0, 1, 2].map((innerNode) => {
              return renderSquare(node, innerNode)
            })}
          </div>
        )
      })}
    </div>
  )
}

Chessboard.propTypes = {
  isPlaying: PropTypes.bool,
  onStart: PropTypes.func,
  onEnd: PropTypes.func,
}
