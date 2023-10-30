import Toastify, { type Options } from 'toastify-js'

const toastAlert = (params: Options): void => {
  Toastify(params).showToast()
}

export default toastAlert
