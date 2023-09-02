import React from 'react'
import PropTypes from 'prop-types'

export default function Scoreboard(props) {
  return (
    <div
      className="bg-white/10 mx-auto mt-24 relative"
      style={{ borderRadius: '40px' }}>
      <div
        className={`flex flex-row gap-x-8 flex-nowrap px-10 py-6 items-start ${
          !props.isPlaying || props?.gameResult ? 'opacity-20' : ''
        }`}>
        <div className="flex flex-col gap-y-2">
          <div
            className="w-20 h-20 rounded-full flex justify-center items-center"
            style={{
              backgroundColor: !props?.isPlaying
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
            }}>
            {props.aiRole === undefined
              ? (
                <></>
              )
              : (
                <img
                  className={`${props.aiRole === 'X' ? 'w-8' : 'w-10'}`}
                  src={`/images/${props.aiRole === 'X' ? 'x' : 'o'}_white.svg`}/>
              )}
          </div>
          <div className="text-white/70 text-center">A.I</div>
          <div className="text-white/30 text-center text-sm">Player 1</div>
        </div>

        <div className="flex justify-center items-center h-20">
          <div className="text-5xl text-white tracking-widest">
            {props.sumOfAiWin}:{props.sumOfPlayerWin}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <div
            className="w-20 h-20 rounded-full flex justify-center items-center"
            style={{
              backgroundColor: !props.isPlaying
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
            }}>
            {props.playerRole === undefined
              ? (
                <></>
              )
              : (
                <img
                  className={`${props.playerRole === 'X' ? 'w-8' : 'w-10'}`}
                  src={`/images/${
                    props.playerRole === 'X' ? 'x' : 'o'
                  }_white.svg`}/>
              )}
          </div>
          <div className="text-white/70 text-center">You</div>
          <div className="text-white/30 text-center text-sm">Player 2</div>
        </div>
      </div>

      {!props.isPlaying && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 flex justify-center items-center z-10"
          style={{ borderRadius: '40px' }}>
          <input
            className="text-white mt-4 text-3xl w-full h-full cursor-pointer"
            type="button"
            value={`${props.gameResult === null ? 'Start' : 'Play Again'}`}
            onClick={() => {
              props.onClick()
            }}/>
        </div>
      )}
    </div>
  )
}

Scoreboard.propTypes = {
  isPlaying: PropTypes.bool,
  aiRole: PropTypes.string,
  sumOfAiWin: PropTypes.number,
  playerRole: PropTypes.string,
  sumOfPlayerWin: PropTypes.number,
  gameResult: PropTypes.string,
  onClick: PropTypes.func,
}
