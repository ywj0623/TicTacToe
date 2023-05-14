import React from 'react'
import { Board } from './Board'

function choosePreEmptive() {
  const randomNum = Math.random() * 100

  if (randomNum < 50) {
    return true
  }

  return false
}

function firstPosition() {
  const random = Math.floor(Math.random() * 10)

  if (0 <= random && random !== 9) {
    const row = Math.floor(random / 3)
    const column = random % 3
    return { row, column }
  }

  return firstPosition()

  // while (!(0 <= random && random !== 9)) {
  //   random = Math.floor(Math.random() * 10)
  // }
  // return random
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

const GameInfos = (props) => {
  if (props.aiIsPreEmptive === undefined) {
    return (
      <input
        className="game-info"
        type="button"
        value="開始遊戲"
        onClick={() => {
          props.onChange({
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

export class Game extends React.Component {
  // 在 subclass 內定義 constructor(a) 時，一定要從呼叫 super(a) 開始
  constructor(props) {
    super(props)
    this.state = {
      squares: Array.from({ length: 3 }, () => Array(3).fill(null)),
      // squares: Array(3).fill(null).map(() => Array(3).fill(null))
      stepNumber: 0,
      oIsNext: true,
      aiIsPreEmptive: undefined,
    }
  }

  firstStepHandler(e) {
    this.setState(() => ({
      aiIsPreEmptive: e.aiIsPreEmptive,
    }))

    if (e.aiIsPreEmptive) {
      const result = firstPosition()
      this.positionHandler(result.row, result.column)
      return
    }

    return
  }

  positionHandler(row, column) {
    const squares = this.state.squares.slice()

    if (
      calculateWinner(this.state.squares) ||
      this.state.squares[row][column]
    ) {
      return
    }

    squares[row][column] = this.state.oIsNext ? 'X' : 'O'
    this.setState({
      squares: squares,
      stepNumber: this.state.stepNumber + 1,
      oIsNext: !this.state.oIsNext,
    })
  }

  render() {
    const winner = calculateWinner(this.state.squares)

    return (
      <>
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={(row, column) => {
                this.positionHandler(row, column)
              }}
            />
          </div>

          <GameInfos
            aiIsPreEmptive={this.state?.aiIsPreEmptive}
            winner={winner}
            oIsNext={this.state.oIsNext}
            stepNumber={this.state.stepNumber}
            onChange={(e) => {
              this.firstStepHandler(e)
            }}
          />
        </div>
      </>
    )
  }
}
