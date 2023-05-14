import React from 'react'

const Square = (props) => {
  return (
    <button
      className="square"
      disabled={props.aiIsPreEmptive === undefined}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

export class Board extends React.Component {
  renderSquare(row, column) {
    return (
      <Square
        key={row * 3 + column}
        aiIsPreEmptive={this.props.aiIsPreEmptive}
        value={this.props.squares[row][column]}
        onClick={() => {
          this.props.onClick(row, column)
        }}
      />
    )
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map((node, idx) => {
          return (
            <div className="board-row" key={idx}>
              {[0, 1, 2].map((innerNode) => {
                return this.renderSquare(node, innerNode)
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
