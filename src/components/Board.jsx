import React from 'react'
import PropTypes from 'prop-types'

const Square = (props) => {
  return (
    <button
      style={{
        width: '150px',
        height: '150px',
        maxWidth: '150px',
        maxHeight: '150px',
        borderRadius: '40px',
        backgroundSize: 'auto',
        backgroundImage: 'url(/images/gird_bg.svg)',
        boxShadow: '0 14px 17px rgb(0, 0, 0, 0.07)',
      }}
      disabled={props?.aiIsPreEmptive === undefined}
      onClick={props?.onClick}
    >
      <span
        className="inline-block w-24 h-24"
        style={{
          backgroundImage:
            props?.value === null
              ? ''
              : props?.value === 'X'
                ? 'url(/images/x_white.svg)'
                : 'url(/images/o_white.svg)',
          backgroundsSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></span>
    </button>
  )
}

Square.propTypes = {
  aiIsPreEmptive: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.string,
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
    <div className="flex flex-col flex-wrap gap-y-5">
      {[0, 1, 2].map((node, idx) => {
        return (
          <div className="flex flex-row gap-x-5 mx-auto" key={idx}>
            {[0, 1, 2].map((innerNode) => {
              return renderSquare(props, node, innerNode)
            })}
          </div>
        )
      })}
    </div>
  )
}
