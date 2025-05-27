import React, {useEffect, useState} from 'react';
import {NativeModules} from 'react-native';

const useNativeMusicPlayer = ({song, restStart, pause, getSoundOffOn}) => {
  const MusicPlayer = NativeModules?.MusicPlayer;

  const [initialized, setInitialized] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (getSoundOffOn) {
      if (initialized)
        restStart ? stopMusicandReset() : pause ? playMusic() : pauseMusic();
      else if (song?.length != 0) setupMusic();
    } else {
      releaseMusic();
    }
  }, [restStart, pause, initialized, song, getSoundOffOn]);

  useEffect(() => {
    // Start updating current position every second
    const intervalId = setInterval(async () => {
      const currentPosition = await MusicPlayer?.getCurrentPosition();
      setCurrentTime(currentPosition);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const setupMusic = async () => {
    const isInitialized = await MusicPlayer?.setupPlayer(song);
    if (isInitialized) {
      setInitialized(true);
      // getDuration();
      setTimeout(() => {
        getDuration();
      }, 1000);
      // setTimeout(() => {
      //   MusicPlayer.play(false); // or true if you want looping
      // }, 1000);
    } else setInitialized(true);
  };

  const getDuration = async () => {
    const time = await MusicPlayer?.getMusicDuration();
    console.log('time', time);
    setDuration(time);
  };

  const seekTo = position => {
    MusicPlayer.seekTo(position * 1000);
    console.log('DURATION SEEK', position);
    getDuration();
  };

  const playMusic = () => {
    console.log('PLAYING', duration);
    MusicPlayer?.play(duration <= 30);
  };

  const pauseMusic = () => {
    console.log('PAUSED', pause);
    MusicPlayer?.pause();
  };

  const stopMusic = () => {
    console.log('STOP');
    MusicPlayer?.stopMusic();
  };
  const stopMusicandReset = () => {
    console.log('STOPandRESET');
    MusicPlayer?.stopMusicandReset();
  };
  const releaseMusic = () => {
  
    setInitialized(false);
    setDuration(0);
    MusicPlayer?.releaseMediaPlayer();
  };

  return {
    playMusic,
    pauseMusic,
    stopMusic,
    releaseMusic,
    stopMusicandReset,
    seekTo,
    currentTime,
    duration,
  };
};

export default useNativeMusicPlayer;
