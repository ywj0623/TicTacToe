import React from 'react'
import PropTypes from 'prop-types'

export default function RoleMark(props) {
  return (
    <div className="flex flex-col gap-y-2">
      <div
        className="w-20 h-20 rounded-full flex justify-center items-center"
        style={{
          backgroundColor: !props?.isPlaying
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.2)',
        }}>
        {props[props.role] === undefined
          ? (
            <></>
          )
          : (
            <img
              className={`${props[props.role] === 'X' ? 'w-8' : 'w-10'}`}
              src={`/images/${
                props[props.role] === 'X' ? 'x' : 'o'
              }_white.svg`}/>
          )}
      </div>

      <div className="text-white/70 text-center">
        {props.role === 'playerRole' ? 'YOU' : 'A.I'}
      </div>

      <div className="text-white/30 text-center text-sm">
        {props.role === 'playerRole' ? 'Player 1' : 'Player 2'}
      </div>
    </div>
  )
}

RoleMark.propTypes = {
  isPlaying: PropTypes.bool,
  playerRole: PropTypes.string,
  aiRole: PropTypes.string,
  role: PropTypes.string,
}