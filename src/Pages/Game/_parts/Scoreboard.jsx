import { React, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'

const RoleMark = lazy(() => import('.//RoleMark'))

export default function Scoreboard(props) {
  return (
    <Suspense>
      <div
        className="bg-white/10 mx-auto mt-24 relative"
        style={{ borderRadius: '40px' }}>
        <div
          className={`flex flex-row gap-x-8 flex-nowrap px-10 py-6 items-start ${
            !props.isPlaying || props?.gameResult ? 'opacity-20' : ''
          }`}>
          <RoleMark
            isPlaying={props.isPlaying}
            playerRole={props.playerRole}
            aiRole={props.aiRole}
            role={'playerRole'}/>

          <div className="flex justify-center items-center h-20">
            <div className="text-5xl text-white tracking-widest">
              {props.sumOfPlayerWin}:{props.sumOfAiWin}
            </div>
          </div>

          <RoleMark
            isPlaying={props.isPlaying}
            playerRole={props.playerRole}
            aiRole={props.aiRole}
            role={'aiRole'}/>
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
    </Suspense>
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
