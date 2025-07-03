package vinelight.ceremony.journal.meditation.timer

import android.media.MediaPlayer
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.IOException

class MusicPlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val mediaPlayers: MutableMap<String, MediaPlayer> = mutableMapOf()
    private val isPausedMap: MutableMap<String, Boolean> = mutableMapOf()

    override fun getName(): String {
        return "MusicPlayer"
    }

    @ReactMethod
    fun setupPlayer(playerId: String, audioSource: String, promise: Promise) {
        try {
            mediaPlayers[playerId]?.release()
            mediaPlayers.remove(playerId)

            val mediaPlayer = MediaPlayer()
            mediaPlayer.setDataSource(audioSource)
            mediaPlayer.prepare()
            mediaPlayers[playerId] = mediaPlayer
            isPausedMap[playerId] = false

            promise.resolve(true)
        } catch (e: IOException) {
            Log.e("MusicPlayer", "Error setting up player: ${e.message}")
            promise.reject("MusicPlayerError", e.message)
        }
    }

    @ReactMethod
    fun play(playerId: String, loop: Boolean = false, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            player.isLooping = loop
            player.start()
            isPausedMap[playerId] = false
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun pause(playerId: String, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null && player.isPlaying) {
            player.pause()
            isPausedMap[playerId] = true
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotPlaying", "Player with id $playerId is not playing")
        }
    }

    @ReactMethod
    fun stop(playerId: String, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            player.stop()
            player.prepare()
            isPausedMap[playerId] = false
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun stopMusicandReset(playerId: String, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            player.stop()
            player.prepare()
            player.seekTo(0)
            isPausedMap[playerId] = false
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun release(playerId: String, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            player.release()
            mediaPlayers.remove(playerId)
            isPausedMap.remove(playerId)
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun releaseAll(promise: Promise) {
        mediaPlayers.values.forEach { it.release() }
        mediaPlayers.clear()
        isPausedMap.clear()
        promise.resolve(true)
    }

    @ReactMethod
    fun getCurrentPosition(playerId: String, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            val currentPositionMillis = player.currentPosition
            promise.resolve(currentPositionMillis / 1000.0) // return in seconds
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun getMusicDuration(playerId: String, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            val durationMillis = player.duration
            promise.resolve(durationMillis / 1000.0) // return in seconds
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun seekTo(playerId: String, positionMillis: Int, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            player.seekTo(positionMillis)
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }

    @ReactMethod
    fun setVolume(playerId: String, volume: Double, promise: Promise) {
        val player = mediaPlayers[playerId]
        if (player != null) {
            val vol = volume.toFloat().coerceIn(0f, 1f)
            player.setVolume(vol, vol)
            promise.resolve(true)
        } else {
            promise.reject("PlayerNotFound", "Player with id $playerId not found")
        }
    }


}
