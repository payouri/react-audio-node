# React Audio Node

## Purpose
This package is a React.js wrapper for the audio tag. It is written in typescript.

## Install
```
npx install @youri-kane/react-audio-node
```

## Usage
```javascript
import { AudioNode } from '@youri-kane/react-audio-node';

const CustomPlayer = () => {
    return <AudioNode 
        muted={true}
        volume={1}
        playState="playing"
        onLoadedMetadata={() => {}}
        onPlayStateChange={() => {}}
        onCurrentTimeChange={() => {}}
        onBufferedChange={() => {}}
        onPlayableStateChange={() => {}}
        source="https://example.com/audio.mp3"
    />
}
```