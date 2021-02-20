import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import {
  PlayPauseControlState,
  PlayStateEvents,
  TrackMetaData,
  AudioNodeExposedRefObject,
  PlayableStateEvents,
} from "./types";

export interface AudioNodeProps {
  muted: boolean;
  playback: number;
  volume: number;
  playState: PlayPauseControlState;
  onCurrentTimeChange: (currentTime: number) => void;
  onLoadedMetadata: (metadata: TrackMetaData) => void;
  onPlayStateChange: (type: PlayStateEvents) => void;
  /**
   * @description
   * - playing
   * - waiting
   * - stalled
   *
   * see corresponding events description on MDN: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
   */
  onPlayableStateChange?: (type: PlayableStateEvents) => void;
  onBufferedChange?: (duration: number, seekable: number) => void;
  source: string;
}

export const AudioNode = forwardRef(
  (
    {
      muted,
      volume,
      playState,
      onLoadedMetadata,
      onPlayStateChange,
      onCurrentTimeChange,
      onBufferedChange,
      onPlayableStateChange,
      source = "https://res.cloudinary.com/dv1hhqgbr/video/upload/v1542978744/Audio/Moha_La_Squale_Ca_c_%C3%A9tait_avant.mp3",
    }: AudioNodeProps,
    forwardedRef: Ref<AudioNodeExposedRefObject>
  ) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(forwardedRef, () => ({
      setPlayback: (value: number) => {
        if (audioRef.current) {
          audioRef.current.currentTime = value;
        }
      },
      setVolume: (value: number) => {
        if (audioRef.current) {
          audioRef.current.currentTime = value;
        }
      },
      setPlaybackRate: (value: number | "default") => {
        if (audioRef.current && typeof value === "number") {
          audioRef.current.playbackRate = value;
        } else if (audioRef.current && value === "default") {
          audioRef.current.playbackRate = audioRef.current.defaultPlaybackRate;
        }
      },
      audioNode: audioRef.current,
    }));

    const handleLoadedMetaData = useCallback(
      ({ target }: React.SyntheticEvent<HTMLAudioElement>) => {
        const audio = target as HTMLAudioElement;
        onLoadedMetadata({
          volume: audio.volume,
          currentTime: audio.currentTime,
          duration: audio.duration,
        });
      },
      [onLoadedMetadata]
    );

    const handlePlayableChange = useCallback(
      (event: Event) => {
        switch (event.type) {
          case "stalled":
          case "waiting":
          case "playing":
            if (typeof onPlayableStateChange === "function") {
              onPlayableStateChange(event.type);
            }
        }
      },
      [onPlayableStateChange]
    );

    const handleProgressChange = useCallback(
      (event: React.SyntheticEvent<HTMLAudioElement>) => {
        if (audioRef.current && audioRef.current.buffered?.length > 0) {
          if (typeof onBufferedChange === "function") {
            console.log(audioRef.current.buffered.start(0));
            onBufferedChange(
              audioRef.current.buffered.end(0),
              audioRef.current?.seekable.length
                ? audioRef.current?.seekable.end(0) ?? 0
                : 0
            );
          }
        }
      },
      [onBufferedChange]
    );

    const handlePlayStateChange = useCallback(
      (event: React.SyntheticEvent<HTMLAudioElement>) => {
        switch (event.type) {
          case "play":
          case "playing":
          case "pause":
          case "ended":
            onPlayStateChange(event.type);
            break;
          default:
            break;
        }
      },
      [onPlayStateChange]
    );

    const handleTimeUpdate = useCallback(
      ({ target }: React.SyntheticEvent<HTMLAudioElement>) => {
        onCurrentTimeChange((target as HTMLAudioElement).currentTime);
      },
      [onCurrentTimeChange]
    );

    useEffect(() => {
      if (audioRef.current) {
        if (playState === "playing") {
          audioRef.current.play();
        } else if (playState === "paused") {
          audioRef.current.pause();
        }
      }
    }, [playState]);

    useEffect(() => {
      if (
        audioRef.current &&
        typeof volume === "number" &&
        volume !== audioRef.current.volume
      ) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

    useEffect(() => {
      if (audioRef.current && audioRef.current.muted !== muted) {
        audioRef.current.muted = muted;
      }
    }, [muted]);

    useLayoutEffect(() => {
      const { current } = audioRef;
      if (current) {
        current.addEventListener("stalled", handlePlayableChange);
        current.addEventListener("waiting", handlePlayableChange);
        current.addEventListener("playing", handlePlayableChange);
      }
      return () => {
        if (current) {
          current.removeEventListener("stalled", handlePlayableChange);
          current.removeEventListener("waiting", handlePlayableChange);
          current.removeEventListener("playing", handlePlayableChange);
        }
      };
    }, [audioRef, handlePlayableChange]);

    return (
      <audio
        id="audio-node"
        src={source}
        ref={audioRef}
        controls
        style={{ display: "none" }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetaData}
        onEnded={handlePlayStateChange}
        onPlay={handlePlayStateChange}
        onPlaying={handlePlayStateChange}
        onPause={handlePlayStateChange}
        onProgress={handleProgressChange}
      />
    );
  }
);

export default AudioNode;
