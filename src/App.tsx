import {useRef, useState, useEffect} from 'react';
import './App.css';
import { useWavesurfer } from '@wavesurfer/react'
import { useWaveformEditorHooks, WaveformEditorProps } from './components/WaveformEditor'

// Test App compares original WaveSurfer component wiht new WaveformEditor component

// Also includes panel for styling editor and toggles and buttons for testing all functionality

function App() {

  // Wavesurfer
  const wavesurferRef = useRef(null)
  const waveformEditorRef = useRef(null)

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: wavesurferRef,
    url: 'audio/mono.mp3',
    waveColor: 'purple',
    height: 100,
  })

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

  // Waveform Editor

  const props : WaveformEditorProps = {
    containerRef: waveformEditorRef,
    url: 'audio/mono.mp3',
    waveColor: 'red',
    height: 100,
    regionColor: 'green',
  }

  const {useWaveformEditor, useWaveformEditorState, useWaveformEditorEvents} = useWaveformEditorHooks(props)

  const waveformEditor = useWaveformEditor(props)
  console.log(waveformEditor)

  return (
    <div className="App">

      <section id="waveformeditor-container">
        <h2>Udio Waveform Editor Component</h2>
        <div ref={waveformEditorRef} />
        <button onClick={()=>{}}>

        </button>
      </section>

      <section id="wavesurfer-container">
        <h2>Wavesurfer Component</h2>
        <div ref={wavesurferRef} />
        <button onClick={onPlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </section>

    </div>
  );
}

export default App;
