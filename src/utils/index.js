export function debounce(func, wait, immediate) {
  let timeout
  let initialArgs
  return function () {
    let context = this, args = arguments
    if (!timeout) {
      initialArgs = args
      if (immediate) func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate || (immediate && initialArgs != args)) func.apply(context, args)
    }, wait)
  }
}
