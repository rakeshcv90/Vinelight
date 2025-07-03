// #import <Foundation/Foundation.h>
// #import "React/RCTBridgeModule.h"

// @interface RCT_EXTERN_MODULE(MusicPlayer, NSObject)

// // Expose the setupPlayer method
// RCT_EXTERN_METHOD(setupPlayer:(NSString *)audioSource resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)

// // Expose the play method
// RCT_EXTERN_METHOD(play:(BOOL)loop)

// // Expose the pause method
// RCT_EXTERN_METHOD(pause)

// // Expose the stopMusic method
// RCT_EXTERN_METHOD(stopMusic)

// RCT_EXTERN_METHOD(stopMusicandReset)

// // Expose the getMusicDuration method
// RCT_EXTERN_METHOD(getMusicDuration:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)

// RCT_EXTERN_METHOD(getCurrentPosition: (RCTPromiseResolveBlock)resolver
//                   rejecter:(RCTPromiseRejectBlock)rejecter)

// RCT_EXTERN_METHOD(seekTo: (NSInteger)position
//                   resolver:(RCTPromiseResolveBlock)resolver
//                   rejecter:(RCTPromiseRejectBlock)rejecter)

// // Expose the releaseMediaPlayer method
// RCT_EXTERN_METHOD(releaseMediaPlayer)

// @end

//#import <Foundation/Foundation.h>
//#import "React/RCTBridgeModule.h"
//
//@interface RCT_EXTERN_MODULE(MusicPlayer, NSObject)
//
//// Expose the setupPlayer method
//RCT_EXTERN_METHOD(setupPlayer:(NSString *)audioSource
//                  resolver:(RCTPromiseResolveBlock)resolver
//                  rejecter:(RCTPromiseRejectBlock)rejecter)
//
//// Expose the play method
//RCT_EXTERN_METHOD(play:(BOOL)loop)
//
//// Expose the pause method
//RCT_EXTERN_METHOD(pause)
//
//// Expose the stopMusic method
//RCT_EXTERN_METHOD(stopMusic)
//
//RCT_EXTERN_METHOD(stopMusicandReset)
//
//// ✅ Expose the setVolume method (this was missing!)
//RCT_EXTERN_METHOD(setVolume:(nonnull NSNumber *)volume)
//
//// Expose the getMusicDuration method
//RCT_EXTERN_METHOD(getMusicDuration:(RCTPromiseResolveBlock)resolver
//                  rejecter:(RCTPromiseRejectBlock)rejecter)
//
//RCT_EXTERN_METHOD(getCurrentPosition:(RCTPromiseResolveBlock)resolver
//                  rejecter:(RCTPromiseRejectBlock)rejecter)
//
//RCT_EXTERN_METHOD(seekTo:(NSInteger)position
//                  resolver:(RCTPromiseResolveBlock)resolver
//                  rejecter:(RCTPromiseRejectBlock)rejecter)
//
//// Expose the releaseMediaPlayer method
//RCT_EXTERN_METHOD(releaseMediaPlayer)
//
//@end

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MusicPlayer, NSObject)

// setupPlayer
RCT_EXTERN_METHOD(setupPlayer:(NSString *)playerId
                  audioSource:(NSString *)audioSource
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// play
RCT_EXTERN_METHOD(play:(NSString *)playerId
                  loop:(BOOL)loop
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// pause
RCT_EXTERN_METHOD(pause:(NSString *)playerId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// stop
RCT_EXTERN_METHOD(stop:(NSString *)playerId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// stopMusicandReset
RCT_EXTERN_METHOD(stopMusicandReset:(NSString *)playerId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// setVolume
RCT_EXTERN_METHOD(setVolume:(NSString *)playerId
                  volume:(nonnull NSNumber *)volume
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// getMusicDuration
RCT_EXTERN_METHOD(getMusicDuration:(NSString *)playerId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// getCurrentPosition
RCT_EXTERN_METHOD(getCurrentPosition:(NSString *)playerId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// seekTo
RCT_EXTERN_METHOD(seekTo:(NSString *)playerId
                  position:(double)position
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)


// release
RCT_EXTERN_METHOD(release:(NSString *)playerId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

// releaseAll
RCT_EXTERN_METHOD(releaseAll:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)



@end

