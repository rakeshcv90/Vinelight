// import {useEffect, useState} from 'react';
// import {
//   Platform,
//   NativeModules,
//   DeviceEventEmitter,
//   NativeEventEmitter,
// } from 'react-native';

// const useNativeMusicPlayer = ({
//   song1,
//   song2,
//   restStart,
//   pause,
//   getSoundOffOn,
// }) => {
//   const MusicPlayer = NativeModules?.MusicPlayer;

//   const [initialized, setInitialized] = useState(false);
//   const [duration, setDuration] = useState({player1: 0, player2: 0});
//   const [currentTime, setCurrentTime] = useState({player1: 0, player2: 0});
//   console.log('XCSOng vcvcvcvxcvxcv', song1);
//   useEffect(() => {
//     if (!MusicPlayer) return;

//     if (getSoundOffOn) {
//       console.log('XLog 1', );
//       if (!initialized && (song1 || song2)) {
//         setupMusic();
//         console.log('XLog 2', );
//       }else{
//         console.log('XLog 5', );
//         releaseMusic('player1');
//         setupMusic();
//       }
//     } else {
//       releaseMusic();
//       console.log('XLog 3', );
//     }
//   }, [song1, song2, getSoundOffOn]);

//   // Monitor pause/play/rest states
//   useEffect(() => {
//     if (!MusicPlayer || !initialized || !getSoundOffOn) return;

//     // if (restStart) {
//     //   stopMusicAndReset();
//     // } else if (pause) {
//     //   pauseMusic();
//     // } else {
//     //   playMusic();
//     // }
//   }, [initialized, pause, restStart, getSoundOffOn]);

//   // Poll current position every 500ms
//   useEffect(() => {
//     if (!MusicPlayer) return;

//     const intervalId = setInterval(async () => {
//       try {
//         const times = {};
//         if (song1)
//           times.player1 =
//             (await MusicPlayer.getCurrentPosition('player1')) || 0;
//         if (song2)
//           times.player2 =
//             (await MusicPlayer.getCurrentPosition('player2')) || 0;
//         setCurrentTime(prev => ({...prev, ...times}));
//       } catch (err) {
//         console.warn('Error fetching current position:', err);
//       }
//     }, 500);

//     return () => clearInterval(intervalId);
//   }, [song1, song2]);

//   // Listen for playback completion
//   useEffect(() => {
//     const emitter =
//       Platform.OS === 'ios'
//         ? new NativeEventEmitter(MusicPlayer)
//         : DeviceEventEmitter;

//     const subscription = emitter.addListener('onMusicComplete', playerId => {
//       console.log(`${playerId} finished`);
//       if (playerId === 'player1') {
//         playMusic('player2');
//       }
//     });

//     return () => subscription.remove();
//   }, []);

//   const setupMusic = async () => {
//     console.log("Testvvv",song1)
//     try {
//       console.log("Testhh",song1)
//       const promises = [];
//       console.log("Testjj",song1)
//       if (song1) promises.push(MusicPlayer.setupPlayer('player1', song1));
//       if (song2) promises.push(MusicPlayer.setupPlayer('player2', song2));

//       const results = await Promise.all(promises);

//       if (results.length > 0 && results.every(r => r)) {
//         setInitialized(true);
//         setTimeout(getDuration, 1000);
//         console.log("Yogesh", initialized)
//       }
//     } catch (err) {
//       console.error('Error setting up music players:', err);
//     }
//   };

//   const waitForDuration = async playerId => {
//     let retries = 10;
//     while (retries--) {
//       const dur = await MusicPlayer.getMusicDuration(playerId);
//       if (dur > 0) return dur;
//       await new Promise(res => setTimeout(res, 300));
//     }
//     return 0;
//   };

//   const getDuration = async () => {
//     try {
//       const durations = {};
//       if (song1) durations.player1 = await waitForDuration('player1');
//       if (song2) durations.player2 = await waitForDuration('player2');
//       setDuration(prev => ({...prev, ...durations}));
//     } catch (err) {
//       console.error('Error getting duration:', err);
//     }
//   };

//   const seekTo = (position, playerId) => {
//     if (!MusicPlayer || typeof position !== 'number') return;

//     if (playerId) {
//       MusicPlayer.seekTo(playerId, position * 1000);
//     } else {
//       ['player1', 'player2'].forEach(id =>
//         MusicPlayer.seekTo(id, position * 1000),
//       );
//     }
//     getDuration();
//   };

//   const playMusic = async playerId => {
//     if (!MusicPlayer) return;
//     console.log('play player id',playerId)
//     if (playerId) {
//       await MusicPlayer.play(playerId, false);
//     } else {
//       await MusicPlayer.play('player1', false);
//       await MusicPlayer.play('player2', false);
//     }
//   };

//   const pauseMusic = playerId => {
//     if (!MusicPlayer) return;

//     if (playerId) {
//       MusicPlayer.pause(playerId);
//     } else {
//       ['player1', 'player2'].forEach(id => MusicPlayer.pause(id));
//     }
//   };

//   const stopMusic = async playerId => {
//     if (!MusicPlayer) return;
//     console.log('get player id player',playerId);
//     if (playerId) {
//       await MusicPlayer.stop(playerId);
//     } else {
//       await MusicPlayer.stop('player1');
//       await MusicPlayer.stop('player2');
//     }
//   };

//   const stopMusicAndReset = async () => {
//     if (!MusicPlayer) return;
//     try {
//       await MusicPlayer.stopMusicandReset('player1');
//       await MusicPlayer.stopMusicandReset('player2');
//     } catch (err) {
//       console.error('Error stopping and resetting music:', err);
//     }
//   };

//   const setVolume = (volume, playerId) => {
//     if (!MusicPlayer || typeof volume !== 'number') return;

//     if (playerId) {
//       MusicPlayer.setVolume(playerId, volume);
//     } else {
//       ['player1', 'player2'].forEach(id => MusicPlayer.setVolume(id, volume));
//     }
//   };

//   const releaseMusic = () => {
//     if (!MusicPlayer) return;

//     setInitialized(false);
//     setDuration({player1: 0, player2: 0});
//     setCurrentTime({player1: 0, player2: 0});

//     ['player1', 'player2'].forEach(id => MusicPlayer.release(id));
//   };

//   const cleanup = async () => {
//     await stopMusic();
//     await stopMusicAndReset();
//     releaseMusic();
//   };

//   return {
//     playMusic,
//     pauseMusic,
//     stopMusic,
//     releaseMusic,
//     stopMusicAndReset,
//     seekTo,
//     setVolume,
//     currentTime,
//     duration,
//     initialized,
//     cleanup,
//   };
// };

// export default useNativeMusicPlayer;


import { useEffect, useState } from 'react';
import {
  Platform,
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';

const useNativeMusicPlayer = ({
  song1,
  song2,
  restStart,
  pause,
  getSoundOffOn,
}) => {
  const MusicPlayer = NativeModules?.MusicPlayer;

  const [initialized, setInitialized] = useState(false);
  const [duration, setDuration] = useState({ player1: 0, player2: 0 });
  const [currentTime, setCurrentTime] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    if (!MusicPlayer) return;

    if (getSoundOffOn) {
      if (!initialized && (song1 || song2)) {
        setupMusic();
      } else {
        releaseMusic('player1');
        setupMusic();
      }
    } else {
      releaseMusic();
    }
  }, [song1, song2, getSoundOffOn]);

  useEffect(() => {
    if (!MusicPlayer) return;

    const intervalId = setInterval(async () => {
      try {
        const times = {};
        if (song1)
          times.player1 = await MusicPlayer.getCurrentPosition('player1') || 0;
        if (song2)
          times.player2 = await MusicPlayer.getCurrentPosition('player2') || 0;
        setCurrentTime(prev => ({ ...prev, ...times }));
      } catch (err) {
        console.warn('Error fetching current position:', err);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [song1, song2]);

  useEffect(() => {
    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(MusicPlayer)
        : DeviceEventEmitter;

    const subscription = emitter.addListener('onMusicComplete', playerId => {
      console.log(`${playerId} finished`);
    });

    return () => subscription.remove();
  }, []);

  const setupMusic = async () => {
    try {
      const promises = [];
      if (song1) promises.push(MusicPlayer.setupPlayer('player1', song1));
      if (song2) promises.push(MusicPlayer.setupPlayer('player2', song2));

      const results = await Promise.all(promises);
      if (results.length > 0 && results.every(r => r)) {
        setInitialized(true);
        setTimeout(getDuration, 1000);
      }
    } catch (err) {
      console.error('Error setting up music players:', err);
    }
  };

  const waitForDuration = async playerId => {
    let retries = 10;
    while (retries--) {
      const dur = await MusicPlayer.getMusicDuration(playerId);
      if (dur > 0) return dur;
      await new Promise(res => setTimeout(res, 300));
    }
    return 0;
  };

  const getDuration = async () => {
    try {
      const durations = {};
      if (song1) durations.player1 = await waitForDuration('player1');
      if (song2) durations.player2 = await waitForDuration('player2');
      setDuration(prev => ({ ...prev, ...durations }));
    } catch (err) {
      console.error('Error getting duration:', err);
    }
  };

  const playMusic = async playerId => {
    if (!MusicPlayer) return;
    await MusicPlayer.play(playerId, false);
  };

  const pauseMusic = playerId => {
    if (!MusicPlayer) return;
    if (playerId) {
      MusicPlayer.pause(playerId);
    } else {
      ['player1', 'player2'].forEach(id => MusicPlayer.pause(id));
    }
  };

  const stopMusic = async playerId => {
    if (!MusicPlayer) return;
    if (playerId) {
      await MusicPlayer.stop(playerId);
    } else {
      await MusicPlayer.stop('player1');
      await MusicPlayer.stop('player2');
    }
  };

  const stopMusicAndReset = async () => {
    if (!MusicPlayer) return;
    try {
      await MusicPlayer.stopMusicandReset('player1');
      await MusicPlayer.stopMusicandReset('player2');
    } catch (err) {
      console.error('Error stopping and resetting music:', err);
    }
  };

  const seekTo = (position, playerId) => {
    if (!MusicPlayer || typeof position !== 'number') return;

    if (playerId) {
      MusicPlayer.seekTo(playerId, position * 1000);
    } else {
      ['player1', 'player2'].forEach(id =>
        MusicPlayer.seekTo(id, position * 1000),
      );
    }
    getDuration();
  };

  const setVolume = (volume, playerId) => {
    if (!MusicPlayer || typeof volume !== 'number') return;

    if (playerId) {
      MusicPlayer.setVolume(playerId, volume);
    } else {
      ['player1', 'player2'].forEach(id => MusicPlayer.setVolume(id, volume));
    }
  };

  const releaseMusic = (playerId) => {
    if (!MusicPlayer) return;
    if (playerId) {
      MusicPlayer.release(playerId);
    } else {
      ['player1', 'player2'].forEach(id => MusicPlayer.release(id));
    }
    setInitialized(false);
    setDuration({ player1: 0, player2: 0 });
    setCurrentTime({ player1: 0, player2: 0 });
  };

  // ✅ Custom method to dynamically load a song to a player
  const setCustomSong = async (uri, playerId = 'player1') => {
    if (!uri || !MusicPlayer) {
      console.warn(`[setCustomSong] Missing uri or MusicPlayer module`);
      return;
    }

    try {
      await MusicPlayer.stop(playerId);
      await MusicPlayer.release(playerId);
      const success = await MusicPlayer.setupPlayer(playerId, uri);
      if (success) {
        console.log(`[setCustomSong] Loaded new song into ${playerId}`);
        const dur = await waitForDuration(playerId);
        setDuration(prev => ({ ...prev, [playerId]: dur }));
      } else {
        console.warn(`[setCustomSong] setupPlayer failed for ${playerId}`);
      }
    } catch (err) {
      console.error(`[setCustomSong] Error setting song on ${playerId}:`, err);
    }
  };

  const cleanup = async () => {
    await stopMusic();
    await stopMusicAndReset();
    releaseMusic();
  };

  return {
    playMusic,
    pauseMusic,
    stopMusic,
    releaseMusic,
    stopMusicAndReset,
    seekTo,
    setVolume,
    setCustomSong,
    currentTime,
    duration,
    initialized,
    cleanup,
  };
};

export default useNativeMusicPlayer;
