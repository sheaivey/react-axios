export function debounce(func, wait, immediate) {
  let timeout
  return function () {
    let context = this, args = arguments
    if (immediate && !timeout) func.apply(context, args)
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
  }
}
