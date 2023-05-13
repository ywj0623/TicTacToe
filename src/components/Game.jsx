import React from 'react'
import { Board } from './Board'

function choosePreEmptive(props) {
  const randomNum = Math.random() * 100

  if (randomNum < 50) {
    return false
  }

  return true
}

function StartGameButton(props) {
  if (props.isPreEmptive === undefined) {
    return (
      <input
        type="button"
        value="開始遊戲"
        onClick={() => {
          props.onChange({
            result: choosePreEmptive(),
          })
        }}
      />
    )
  }

  return `你是${props.isPreEmptive ? '先攻：X' : '後攻：O'}`
}

function firstStep() {
  let random = Math.floor(Math.random() * 10)

  if (0 <= random && random !== 9) {
    return random
  }

  return firstStep()

  // while (!(0 <= random && random !== 9)) {
  //   random = Math.floor(Math.random() * 10)
  // }

  // return random
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

export class Game extends React.Component {
  // 在 subclass 內定義 constructor(a) 時，一定要從呼叫 super(a) 開始
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(9).fill(null),
      stepNumber: 0,
      xIsNext: true,
      isPreEmptive: undefined,
    }
  }

  handleClick(i) {
    const squares = this.state.squares.slice()

    if (calculateWinner(this.state.squares) || this.state.squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      squares: squares,
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
    })
  }

  render() {
    const winner = calculateWinner(this.state.squares)

    let status

    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status =
        this.state.stepNumber !== 9
          ? `下一位: ${this.state.xIsNext ? 'X' : 'O'}`
          : '和局'
    }

    return (
      <>
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={(i) => {
                this.handleClick(i)
              }}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
          </div>

          <StartGameButton
            isPreEmptive={this.state?.isPreEmptive}
            onChange={(e) => {
              this.setState(() => ({
                isPreEmptive: e.result,
              }))
            }}
          />
        </div>
      </>
    )
  }
}
