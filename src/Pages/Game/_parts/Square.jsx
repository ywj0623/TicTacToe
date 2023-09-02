import React from 'react'
import PropTypes from 'prop-types'

export default function Square(props) {
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
      disabled={!props?.isPlaying}
      onClick={props?.onClick}>
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
        }}></span>
    </button>
  )
}

Square.propTypes = {
  // aiIsPreEmptive: PropTypes.bool,
  // onClick: PropTypes.func,
  // value: PropTypes.string,
  // ---
  isPlaying: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
}
