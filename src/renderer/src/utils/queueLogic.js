/**
 * @PATH [src/renderer/src/utils/queueLogic.js]
 * @REV 20260910-1150
 * @MODULE [AURALIS]
 * @STATUS [DEV]
 * @FILETYPE [UTL]
 * @DESC [Pure queue advance/retreat math. No React, no side effects — unit-testable.]
 * @COMPLIANCE [None]
 * -------------------------------------
 * @TODO_START
 * @TODO_END
 * =====================================*/

/**
 * Decide the next queue index when a track ends or Next is pressed.
 * Returns an index, or null meaning "stop, queue is done".
 *
 * mode:
 *   NORMAL      → advance; stop at end of queue
 *   LOOP_ALL    → advance; wrap to 0 at the end
 *   LOOP_TRACK  → same index again (replay)  [manual Next overrides this]
 *   SHUFFLE     → random index that is not the current one (unless queue has 1)
 *
 * rng is injectable (defaults to Math.random) so tests are deterministic.
 */
export function computeNextIndex(mode, position, length, manual = false, rng = Math.random) {
  if (!length || length <= 0) return null

  if (mode === 'LOOP_TRACK' && !manual) return position

  if (mode === 'SHUFFLE') {
    if (length === 1) return 0
    let next = Math.floor(rng() * (length - 1))
    if (next >= position) next += 1 // skip current without re-rolling
    return next
  }

  const next = position + 1
  if (next >= length) {
    return mode === 'LOOP_ALL' ? 0 : null
  }
  return next
}

/**
 * Decide the previous index for the Prev button.
 * Convention (every player does this): if more than 3 seconds into the
 * track, Prev means "restart this track" — signalled by returning the
 * SAME index with restart:true. Otherwise step back, clamping at 0.
 */
export function computePrevIndex(position, currentTimeSeconds) {
  if (currentTimeSeconds > 3) return { index: position, restart: true }
  return { index: Math.max(0, position - 1), restart: false }
}
