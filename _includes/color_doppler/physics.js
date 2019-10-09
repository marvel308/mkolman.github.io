/**
 * Given a velocity v (-1, 1) in part speed of light it returns the ratio
 * between observed and source wavelengths
 */
function getDopplerFactor(v) {
  return Math.sqrt((1+v)/(1-v))
}
