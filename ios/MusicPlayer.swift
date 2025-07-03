//import Foundation
//import AVFoundation
//import React
//
//@objc(MusicPlayer)
//class MusicPlayer: NSObject {
//  private var audioPlayer: AVPlayer?
//  private var isInitialized: Bool = false
//
//  @objc(setupPlayer:resolver:rejecter:)
//  func setupPlayer(audioSource: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
//    // Check if the audioSource is a valid URL
//    if let audioURL = URL(string: audioSource), audioURL.scheme?.hasPrefix("http") == true {
//      // Remote URL case
//      audioPlayer = AVPlayer(url: audioURL)
//    } else {
//      // Local file case
//      guard let localFileURL = Bundle.main.url(forResource: audioSource, withExtension: nil) else {
//        rejecter("Error", "Invalid file path or URL: \(audioSource)", nil)
//        return
//      }
//      audioPlayer = AVPlayer(url: localFileURL)
//    }
//    
//    audioPlayer?.automaticallyWaitsToMinimizeStalling = false
//    isInitialized = true
//    // Pause the player immediately after setting it up
//    audioPlayer?.pause()
//    resolver(isInitialized)
//  }
//
//
//@objc(play:)
//func play(_ loop: Bool = false) {
//  // ✅ Set up audio session to allow playback
//  do {
//    try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
//    try AVAudioSession.sharedInstance().setActive(true)
//  } catch {
//    print("❌ Failed to activate AVAudioSession:", error)
//  }
//
//  // ✅ Play audio
//  audioPlayer?.play()
//  print("🎧 Audio playback started") // ← this line confirms execution
//
//
//  // ✅ Handle looping
//  if loop {
//    NotificationCenter.default.addObserver(
//      self,
//      selector: #selector(restartMusic),
//      name: .AVPlayerItemDidPlayToEndTime,
//      object: audioPlayer?.currentItem
//    )
//  }
//}
//
//  @objc private func restartMusic() {
//    audioPlayer?.seek(to: CMTime.zero)
//    audioPlayer?.play()
//  }
//
//  @objc(pause)
//  func pause() {
//    audioPlayer?.pause()
//  }
//
//  @objc(stopMusic)
//  func stopMusic() {
//    audioPlayer?.pause()
//    audioPlayer?.seek(to: CMTime.zero)
//  }
//@objc(setVolume:)
//func setVolume(_ volume: NSNumber) {
//    let vol = Float(truncating: volume)
//
//    guard let player = audioPlayer, let currentItem = player.currentItem else {
//        print("⚠️ No player or item available")
//        return
//    }
//
//    let audioTracks = currentItem.asset.tracks(withMediaType: .audio)
//    guard let audioTrack = audioTracks.first else {
//        print("⚠️ No audio track found")
//        return
//    }
//
//    let inputParams = AVMutableAudioMixInputParameters(track: audioTrack)
//    inputParams.setVolume(vol, at: .zero)
//
//    let audioMix = AVMutableAudioMix()
//    audioMix.inputParameters = [inputParams]
//
//    currentItem.audioMix = audioMix
//
//    print("🔊 Volume set to \(vol)")
//}
//  @objc(stopMusicandReset)
//  func stopMusicandReset() {
//    if let player = audioPlayer, player.timeControlStatus == .playing || player.rate == 0 {
//      player.pause()
//      player.seek(to: CMTime.zero)
//      print("Audio playback stopped and reset.")
//    }
//  }
//  
//  @objc(getMusicDuration:rejecter:)
//  func getMusicDuration(resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
//      if let currentItem = audioPlayer?.currentItem {
//          let duration = CMTimeGetSeconds(currentItem.duration)
//          
//          // Check if the duration is a valid finite number
//          if duration.isFinite {
//              resolver(Int(duration))
//          } else {
//              // If duration is not valid, return 0 or an appropriate error
//              resolver(0)
//          }
//      } else {
//          resolver(0)  // Return 0 if there is no current item
//      }
//  }
//  
//  // Function to get Current Music Position
//  @objc(getCurrentPosition:rejecter:)
//    func getCurrentPosition(resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
//      if let currentItem = audioPlayer?.currentItem {
//        let currentTime = CMTimeGetSeconds(currentItem.currentTime())
//        resolver(Int(currentTime))
//      } else {
//        resolver(0)
//      }
//    }
//
//    // function to seek to a specific position in seconds
//    @objc(seekTo:resolver:rejecter:)
//    func seekTo(position: Int, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
//      let seekTime = CMTimeMake(value: Int64(position), timescale: 1000)
//      audioPlayer?.seek(to: seekTime, completionHandler: { completed in
//        if completed {
//          resolver(true)
//        } else {
//          rejecter("SeekError", "Failed to seek to position \(position)", nil)
//        }
//      })
//    }
//  
//  @objc(releaseMediaPlayer)
//  func releaseMediaPlayer() {
//    audioPlayer = nil
//    isInitialized = false
//  }
//}
import Foundation
import AVFoundation
import React

@objc(MusicPlayer)
class MusicPlayer: NSObject {
  private var players: [String: AVPlayer] = [:]
  private var isPausedMap: [String: Bool] = [:]

  @objc(setupPlayer:audioSource:resolver:rejecter:)
  func setupPlayer(playerId: String, audioSource: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    if let url = URL(string: audioSource), url.scheme?.hasPrefix("http") == true {
      players[playerId]?.pause()
      players[playerId] = AVPlayer(url: url)
      isPausedMap[playerId] = false
      resolver(true)
    } else if let localUrl = Bundle.main.url(forResource: audioSource, withExtension: nil) {
      players[playerId]?.pause()
      players[playerId] = AVPlayer(url: localUrl)
      isPausedMap[playerId] = false
      resolver(true)
    } else {
      rejecter("InvalidSource", "Invalid file path or URL: \(audioSource)", nil)
    }
  }

  @objc(play:loop:resolver:rejecter:)
  func play(playerId: String, loop: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let player = players[playerId] else {
      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
      return
    }

    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
      try AVAudioSession.sharedInstance().setActive(true)
    } catch {
      print("AudioSession error: \(error)")
    }

    player.play()
    isPausedMap[playerId] = false

    if loop {
      NotificationCenter.default.addObserver(forName: .AVPlayerItemDidPlayToEndTime, object: player.currentItem, queue: .main) { _ in
        player.seek(to: CMTime.zero)
        player.play()
      }
    }

    resolver(true)
  }

  @objc(pause:resolver:rejecter:)
  func pause(playerId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let player = players[playerId], player.timeControlStatus == .playing else {
      rejecter("PlayerNotPlaying", "Player with id \(playerId) is not playing", nil)
      return
    }

    player.pause()
    isPausedMap[playerId] = true
    resolver(true)
  }

  @objc(stop:resolver:rejecter:)
  func stop(playerId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let player = players[playerId] else {
      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
      return
    }

    player.pause()
    player.seek(to: CMTime.zero)
    isPausedMap[playerId] = false
    resolver(true)
  }

  @objc(stopMusicandReset:resolver:rejecter:)
  func stopMusicandReset(playerId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let player = players[playerId] else {
      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
      return
    }

    player.pause()
    player.seek(to: CMTime.zero)
    isPausedMap[playerId] = false
    resolver(true)
  }

  @objc(release:resolver:rejecter:)
  func release(playerId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    // if players[playerId] != nil {
    //   players[playerId] = nil
    //   isPausedMap[playerId] = nil
    //   resolver(true)
    // } else {
    //   rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
    // }

    if let player = players[playerId] {
            player.pause()
            // Optionally seek to the beginning
            player.seek(to: CMTime.zero)
            // Release the player
            players[playerId] = nil
            isPausedMap[playerId] = nil
            resolver(true)
        } else {
            rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
        }
  }

  @objc(releaseAll:)
  func releaseAll(resolver: @escaping RCTPromiseResolveBlock) {
    players.removeAll()
    isPausedMap.removeAll()
    resolver(true)
  }

  @objc(getCurrentPosition:resolver:rejecter:)
  func getCurrentPosition(playerId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let player = players[playerId] else {
      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
      return
    }

    let currentTime = CMTimeGetSeconds(player.currentTime())
    resolver(currentTime)
  }

  @objc(getMusicDuration:resolver:rejecter:)
  func getMusicDuration(playerId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let item = players[playerId]?.currentItem else {
      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
      return
    }

    let duration = CMTimeGetSeconds(item.duration)
    resolver(duration.isFinite ? duration : 0)
  }

  @objc(seekTo:position:resolver:rejecter:)
  func seekTo(playerId: String, position: Double, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let player = players[playerId] else {
      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
      return
    }

    let seekTime = CMTime(seconds: position, preferredTimescale: 1000)
    player.seek(to: seekTime, completionHandler: { success in
      success ? resolver(true) : rejecter("SeekError", "Failed to seek", nil)
    })
  }

//  @objc(setVolume:volume:resolver:rejecter:)
//  func setVolume(playerId: String, volume: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
//    guard let player = players[playerId], let item = player.currentItem else {
//      rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
//      return
//    }
//
//    guard let track = item.asset.tracks(withMediaType: .audio).first else {
//      rejecter("TrackError", "No audio track found", nil)
//      return
//    }
//
//    let vol = Float(volume.clamped(to: 0.0...1.0))
//    let inputParams = AVMutableAudioMixInputParameters(track: track)
//    inputParams.setVolume(vol, at: .zero)
//
//    let mix = AVMutableAudioMix()
//    mix.inputParameters = [inputParams]
//    item.audioMix = mix
//
//    resolver(true)
//    
//     
//  }
  @objc(setVolume:volume:resolver:rejecter:)
  func setVolume(playerId: String, volume: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
      guard let player = players[playerId], let item = player.currentItem else {
          rejecter("PlayerNotFound", "Player with id \(playerId) not found", nil)
          return
      }

      guard let track = item.asset.tracks(withMediaType: .audio).first else {
          rejecter("TrackError", "No audio track found", nil)
          return
      }

      let rawVolume = Float(truncating: volume)
      let vol = max(0.0, min(rawVolume, 1.0)) // Clamped between 0.0 and 1.0

      let inputParams = AVMutableAudioMixInputParameters(track: track)
      inputParams.setVolume(vol, at: .zero)

      let mix = AVMutableAudioMix()
      mix.inputParameters = [inputParams]
      item.audioMix = mix

      resolver(true)
  }
}


public extension Comparable {
  func clamped(to limits: ClosedRange<Self>) -> Self {
    return min(max(self, limits.lowerBound), limits.upperBound)
  }
}

