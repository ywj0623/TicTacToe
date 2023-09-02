/* eslint-disable react/prop-types */
import { React, useReducer, Suspense, lazy } from 'react'

const Chessboard = lazy(() => import('./_parts/Chessboard'))
const Scoreboard = lazy(() => import('./_parts/Scoreboard'))

export default function Game() {
  const [state, dispatch] = useReducer(stateReducer, {
    isPlaying: false,
    aiRole: undefined,
    sumOfAiWin: 0,
    playerRole: undefined,
    sumOfPlayerWin: 0,
    gameResult: null, // 'X', 'O', 'tied'
  })

  function stateReducer(state, action) {
    switch (action.type) {
    case 'isPlaying':
      return { ...state, isPlaying: !state.isPlaying }
    case 'aiRole':
      return { ...state, aiRole: action.payload }
    case 'playerRole':
      return { ...state, playerRole: action.payload }
    case 'gameResult':
      return { ...state, gameResult: action.payload }
    case 'aiWin':
      return { ...state, sumOfAiWin: state.sumOfAiWin + 1 }
    case 'playerWin':
      return { ...state, sumOfPlayerWin: state.sumOfPlayerWin + 1 }
    }
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen container mx-auto flex flex-col items-middle justify-center">
          <Chessboard
            isPlaying={state.isPlaying}
            onStart={(result) => {
              dispatch({
                type: 'aiRole',
                payload: result.aiRole,
              })
              dispatch({
                type: 'playerRole',
                payload: result.playerRole,
              })
              dispatch({
                type: 'gameResult',
                payload: null,
              })
            }}
            onEnd={(result) => {
              dispatch({
                type: 'gameResult',
                payload: result.gameResult,
              })
              dispatch({ type: 'isPlaying' })

              switch (result.gameResult) {
              case 'X':
              case 'O':
                state.aiRole === result.gameResult
                  ? dispatch({ type: 'aiWin' })
                  : dispatch({ type: 'playerWin' })
                return

              case 'tied':
                return
              }
              return
            }}/>

          <div className="my-12"></div>

          <Scoreboard
            isPlaying={state.isPlaying}
            aiRole={state.aiRole}
            sumOfAiWin={state.sumOfAiWin}
            playerRole={state.playerRole}
            sumOfPlayerWin={state.sumOfPlayerWin}
            gameResult={state.gameResult}
            onClick={() => {
              dispatch({ type: 'isPlaying' })
            }}/>
        </div>
      </Suspense>
    </>
  )
}
