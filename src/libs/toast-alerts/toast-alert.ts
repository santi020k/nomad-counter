import colors from 'tailwindcss/colors'
import toastify, { type Options } from 'toastify-js'

export const defaultParams: toastify.Options = {
  gravity: 'bottom',
  position: 'right',
  close: true,
  className: 'alert'
}

export const defaultStyles = {
  position: 'fixed',
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
  width: 'auto'
}

export const toastAlert = (params: Options): void => {
  toastify({
    ...defaultParams,
    ...params,
    style: {
      ...defaultStyles,
      ...params.style
    }
  })?.showToast()
}

export const toastSuccess = (params: Options): void => {
  toastAlert({
    ...params,
    className: 'alert alert-success',
    style: {
      color: colors.gray[100],
      background: `linear-gradient(to right, ${colors.green[800]}, ${colors.green[700]})`
    }
  })
}

export const toastError = (params: Options): void => {
  toastAlert({
    ...params,
    className: 'alert alert-error',
    style: {
      background: `linear-gradient(to right, ${colors.red[900]}, ${colors.red[700]})`
    }
  })
}
