/**
 * @PATH [src/renderer/src/components/ui/MiniPlayer.jsx]
 * @REV 20260910-1150
 * @MODULE [AURALIS]
 * @STATUS [DEV]
 * @FILETYPE [CMP]
 * @DESC [Mini Mode — rigid rectangle, solid background, no WebGL. PRD Mode-Swap target.]
 * @COMPLIANCE [None]
 * -------------------------------------
 * @TODO_START
 * @TODO_END
 * =====================================*/

/* eslint-disable react/prop-types */

import { useAudioEngine } from '../../contexts/AudioEngineProvider'
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, TruthIcon } from './IconLibrary'

// The Electron window is snapped to 300x150 by main. This fills it
// edge-to-edge as a plain opaque rectangle: the PRD's "standard, rigid,
// DOM-based" mode. The audio element lives in the provider, above this
// component — so mounting/unmounting Mini never touches the stream.
export default function MiniPlayer({ onExitMini }) {
  const { togglePlayback, playNext, playPrev, status, currentTrack, progress } = useAudioEngine()

  const duration = currentTrack?.duration || 1
  const progressPercent = Math.min(100, (progress / duration) * 100)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-control)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '10px 12px',
      fontFamily: 'var(--font-family)',
      WebkitAppRegion: 'drag' // whole surface drags; controls opt out below
    }}>

      {/* Row 1: title + return-to-truth button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.85em', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack ? currentTrack.title : 'Auralis'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.7em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack ? currentTrack.artist : 'Mini Mode'}
          </div>
        </div>
        <button
          onClick={onExitMini}
          title="Back to Truth Mode"
          style={{ ...miniBtn, WebkitAppRegion: 'no-drag' }}
        >
          <TruthIcon />
        </button>
      </div>

      {/* Row 2: transport */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', WebkitAppRegion: 'no-drag' }}>
        <button onClick={playPrev} style={miniBtn} disabled={!currentTrack}><PrevIcon /></button>
        <button
          onClick={togglePlayback}
          disabled={!currentTrack}
          style={{ ...miniBtn, background: 'var(--accent-main)', color: '#000', width: '36px', height: '36px' }}
        >
          {status === 'PLAYING' ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={playNext} style={miniBtn} disabled={!currentTrack}><NextIcon /></button>
      </div>

      {/* Row 3: slim progress strip */}
      <div style={{ height: '3px', background: 'var(--bg-panel)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent-main)', transition: 'width 0.25s linear' }} />
      </div>

    </div>
  )
}

const miniBtn = {
  background: 'var(--bg-panel)',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: 'var(--border-radius)',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}
