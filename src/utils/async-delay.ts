import { logColor } from './log-color'

export async function asyncDelay(miliseconds: number = 0, verbose = false) {
  if (miliseconds <= 0) return

  if (verbose) {
    logColor(`Delaying for ${miliseconds / 1000}s`)
  }

  await new Promise((resolve) => {
    setTimeout(resolve, miliseconds)
  })
}
