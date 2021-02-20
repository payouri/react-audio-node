export type AudioNodeExposedRefObject = {
  setPlayback: (value: number) => void;
  setVolume: (value: number) => void;
  setPlaybackRate: (value: number | "default") => void;
  audioNode: HTMLAudioElement | null;
};

export type TrackMetaData = {
  volume: number;
  currentTime: number;
  duration: number;
};

export type PlayStateEvents = "play" | "playing" | "pause" | "ended";

export type PlayableStateEvents = "stalled" | "waiting" | "playing";

export type PlayPauseControlState = "playing" | "paused";
