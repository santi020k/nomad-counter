import Toastify, { type Options } from 'toastify-js'
import colors from 'tailwindcss/colors'

export const toastAlert = (params: Options): void => {
  Toastify({
    ...params,
    gravity: 'bottom',
    position: 'right',
    close: true,
    style: {
      position: 'absolute',
      zIndex: '1',
      right: '1rem',
      padding: '1rem',
      lineHeight: '1',
      color: colors.white,
      borderRadius: '0.25rem',
      cursor: 'default',
      gap: '.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...params.style
    }
  }).showToast()
}

export const toastSuccess = (params: Options): void => {
  toastAlert({
    ...params,
    className: 'success',
    style: {
      background: `linear-gradient(to right, ${colors.green[800]}, ${colors.green[600]})`
    }
  })
}

export const toastError = (params: Options): void => {
  toastAlert({
    ...params,
    className: 'success',
    style: {
      background: `linear-gradient(to right, ${colors.red[800]}, ${colors.red[600]})`
    }
  })
}
