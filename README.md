# Waveform Editor

[Product Requirements & Spec Document]
(https://docs.google.com/document/d/1RpmqA1lvlcHWluTdqFVjn0JqOOa_uifrncxbG1q1_wM/edit)

## File Structure

WaveformEditor : top-level component; exposes hooks for events, props, and player
EventsStore : Redux store for emitting and listening to events; supports edit history/timeline
	↳ EventTypes
    ↳ EventActions
    ↳ EventReducer
    ↳ EventStore
Player : (emits events)
Renderer : (emits events)
WebAudio : (emits events)
Timer :  (emits events)
Decoder 
Minimap
ToolPane
Tools : Workflow components for editing audio and creating/manipulating timeline objects
    ↳ Tool	: Generic class for a tool
    ↳ Select
    ↳ CreateMarker
    ↳ CreateRegion
    ↳ CreateBeatGrid
    ↳ Extend
    ↳ Inpaint
    ↳ Audition
TimelineObjects : components that exist on the waveform timeline 
    ↳ TimelineObject : generic class for a timeline object
    ↳ Marker
    ↳ Region : contains region-specific tools
    ↳ BeatGrid
    ↳ Playhead

## Testing

jest for unit and integration
cypress for e2e and cross-browser compatibility
eslint airbnb typescript 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.