import React from 'react'

const Square = (props) => {
  return (
    <button
      className="square"
      disabled={props?.aiIsPreEmptive === undefined}
      onClick={props?.onClick}
    >
      {props?.value}
    </button>
  )
}

const renderSquare = (props, row, column) => {
  return (
    <Square
      key={row * 3 + column}
      aiIsPreEmptive={props?.aiIsPreEmptive}
      value={props?.squares[row][column]}
      onClick={() => {
        props?.onClick(row, column)
      }}
    />
  )
}

export default function Board(props) {
  return (
    <div>
      {[0, 1, 2].map((node, idx) => {
        return (
          <div className="board-row" key={idx}>
            {[0, 1, 2].map((innerNode) => {
              return renderSquare(props, node, innerNode)
            })}
          </div>
        )
      })}
    </div>
  )
}
