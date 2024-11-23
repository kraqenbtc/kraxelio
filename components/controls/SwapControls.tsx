import { useState } from 'react'
import { SpeakerHigh, SpeakerSlash, ArrowsOutSimple, ArrowsInSimple } from '@phosphor-icons/react'

interface SwapControlsProps {
  onFullscreenToggle: () => void
  isFullscreen: boolean
  onSoundToggle: () => void
  isSoundEnabled: boolean
}

export const SwapControls = ({ 
  onFullscreenToggle, 
  isFullscreen, 
  onSoundToggle, 
  isSoundEnabled 
}: SwapControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={onSoundToggle}
        className="pixel-button-icon"
      >
        {isSoundEnabled ? (
          <SpeakerHigh size={20} className="pixelated" />
        ) : (
          <SpeakerSlash size={20} className="pixelated" />
        )}
      </button>
      
      <button
        onClick={onFullscreenToggle}
        className="pixel-button-icon"
      >
        {isFullscreen ? (
          <ArrowsInSimple size={20} className="pixelated" />
        ) : (
          <ArrowsOutSimple size={20} className="pixelated" />
        )}
      </button>
    </div>
  )
} 