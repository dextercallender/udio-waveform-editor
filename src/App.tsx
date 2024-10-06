import {useRef, useState, useEffect} from 'react';
import './App.css';
import { useWavesurfer } from '@wavesurfer/react'

// Test App compares original WaveSurfer component wiht new WaveformEditor component

// Also includes panel for styling editor and toggles and buttons for testing all functionality


function App() {

  const containerRef = useRef(null)

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: 'audio/mono.mp3',
    waveColor: 'purple',
    height: 100,
  })

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

  return (
    <div className="App">

      <header>
        
      </header>

      <section id="waveformeditor-container">
        <h2>Udio Waveform Editor Component</h2>
        <p> TODO </p>
      </section>

      <section id="wavesurfer-container">
        <h2>Wavesurfer Component</h2>
        <div ref={containerRef} />
        <button onClick={onPlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </section>

    </div>
  );
}

export default App;
