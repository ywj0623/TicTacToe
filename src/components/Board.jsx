import React from 'react'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

export class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i)
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
              {[0, 1, 2].map((innerNode, innerIdx) => {
                return this.renderSquare(3 * node + innerNode)
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
