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

const GameInfos = (props) => {
  if (props.aiIsPreEmptive === undefined) {
    return (
      <input
        className="game-info"
        type="button"
        value="開始遊戲"
        onClick={() => {
          props?.onChange({
            aiIsPreEmptive: choosePreEmptive(),
          })
        }}
      />
    )
  }

  return (
    <div className="game-info">
      <div>你是{props.aiIsPreEmptive ? '後攻：O' : '先攻：X'}</div>
      {props.winner ? (
        <>
          <div>贏家是 {props.winner}</div>
        </>
      ) : (
        <>
          <div>目前： {props.oIsNext ? 'X' : 'O'}</div>
          {props.stepNumber !== 9 ? (
            <div>下一位： {props.oIsNext ? 'O' : 'X'}</div>
          ) : (
            <div>和局</div>
          )}
        </>
      )}
    </div>
  )
}

function choosePreEmptive() {
  const randomNum = Math.random() * 100

  if (randomNum < 50) {
    return true
  }

  return false
}

function randomPosition(targetArray = null) {
  const randomNum = Math.floor(Math.random() * 10)
  const condition = targetArray
    ? targetArray.includes(randomNum)
    : 0 <= randomNum && randomNum !== 9

  if (condition) {
    const row = Math.floor(randomNum / 3)
    const column = randomNum % 3
    return { row, column }
  }

  return targetArray ? randomPosition(targetArray) : randomPosition()
}

function calculateWinner(squares) {
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

function betterPositionWeighting(gameInfos, weightingList) {
  const squares = gameInfos.squares
  const betterPosition = [
    [0, 0], // 0
    [0, 2], // 1
    [1, 1], // 2
    [2, 0], // 3
    [2, 2], // 4
  ]

  for (let i = 0; i < betterPosition.length; i++) {
    const [a, b] = betterPosition[i]

    if (squares[a][b] === null) {
      weightingList[`${a}, ${b}`] += 5
    }
  }

  return weightingList
}

function basicDefenseWeighting(gameInfos, weightingList) {
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
    } else if (squares[a][b] === gameInfos.roles.NPC) {
      weightingList[`${a}, ${b}`] = 0
    }
  }

  // console.log(weightingList)
  return weightingList
}

export default function Game() {
  const [state, dispatch] = useReducer(reducer, {
    // only keep variants which will change during re-rendering
    aiIsPreEmptive: undefined,
    roles: {
      Player: undefined,
      NPC: undefined,
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

  const positionHandler = useCallback(
    (row, column) => {
      const squares = state.squares.slice()

      if (calculateWinner(state?.squares) || state?.squares[row][column]) {
        return
      }

      squares[row][column] = state.oIsNext ? 'X' : 'O'
      return squares
    },
    [state.squares, state.oIsNext]
  )

  useEffect(() => {
    if (state.aiIsPreEmptive === true) {
      dispatch({ type: 'NPC_X' })
    } else if (state.aiIsPreEmptive === false) {
      dispatch({ type: 'NPC_O' })
    }

    if (state.roles.NPC === 'O' && !state.oIsNext) {
      console.log(1)
      const result = generatePosition(state, weightingList)
      const updateSquares = positionHandler(result.row, result.column)

      if (updateSquares) {
        dispatch({ type: 'updateSquares', payload: updateSquares })
        dispatch({ type: 'accumulateStepNumber' })
        dispatch({ type: 'oIsNext' })
      } else {
        console.log('generatePosition function crush')
      }
    } else if (state.roles.NPC === 'X' && state.oIsNext) {
      console.log(2)
      const result = generatePosition(state, weightingList)
      const updateSquares = positionHandler(result.row, result.column)

      if (updateSquares) {
        dispatch({ type: 'updateSquares', payload: updateSquares })
        dispatch({ type: 'accumulateStepNumber' })
        dispatch({ type: 'oIsNext' })
      } else {
        console.log('generatePosition function crush')
      }
    }

    dispatch({ type: 'updateWinner' })
  }, [state.aiIsPreEmptive, positionHandler])

  function reducer(state, action) {
    switch (action.type) {
      case 'aiIsPreEmptive_True':
        return { ...state, aiIsPreEmptive: true }
      case 'aiIsPreEmptive_False':
        return { ...state, aiIsPreEmptive: false }
      case 'NPC_O':
        return { ...state, roles: { NPC: 'O', Player: 'X' } }
      case 'NPC_X':
        return { ...state, roles: { NPC: 'X', Player: 'O' } }
      case 'updateSquares':
        return { ...state, squares: action.payload }
      case 'accumulateStepNumber':
        return { ...state, stepNumber: state.stepNumber + 1 }
      case 'toggleOIsNext':
        return { ...state, oIsNext: !state.oIsNext }
      case 'updateWinner':
        return { ...state, winner: calculateWinner(state.squares) }
      default:
        throw new Error()
    }
  }

  function firstStepHandler(e) {
    if (e.aiIsPreEmptive) {
      dispatch({ type: 'aiIsPreEmptive_True' })
      const result = randomPosition()
      const updateSquares = positionHandler(result.row, result.column)
      if (updateSquares) {
        dispatch({
          type: 'updateSquares',
          payload: updateSquares,
        })
        dispatch({ type: 'accumulateStepNumber' })
        dispatch({ type: 'toggleOIsNext' })
      } else {
        console.log('generatePosition function crush')
      }
      return
    }

    dispatch({ type: 'aiIsPreEmptive_False' })
    return
  }

  function generatePosition(gameInfos, weightingList) {
    betterPositionWeighting(gameInfos, weightingList)
    basicDefenseWeighting(gameInfos, weightingList)

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

      result = randomPosition(indices)
    } else {
      indices.push(target)
      result = randomPosition(indices)
    }

    return result
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            aiIsPreEmptive={state.aiIsPreEmptive}
            squares={state.squares}
            onClick={(row, column) => {
              const updateSquares = positionHandler(row, column)
              if (updateSquares) {
                dispatch({
                  type: 'updateSquares',
                  payload: updateSquares,
                })
                dispatch({ type: 'accumulateStepNumber' })
                dispatch({ type: 'toggleOIsNext' })
              } else {
                console.log('generatePosition function crush')
              }
            }}
          />
        </div>

        <GameInfos
          aiIsPreEmptive={state.aiIsPreEmptive}
          oIsNext={state.oIsNext}
          stepNumber={state.stepNumber}
          winner={state.winner}
          onChange={(e) => {
            firstStepHandler(e)
          }}
        />
      </div>
    </>
  )
}
