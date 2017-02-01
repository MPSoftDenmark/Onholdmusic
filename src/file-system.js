import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import Track from './track'

class FileSystemAdapter {

  constructor(dir) {
    this.tracks = []
    this.tracksDir = dir
  }

  loadTracks(callback) {
    fs.readdir(this.tracksDir, (err, files) => {
      if (err) throw err

      this.tracks = files
      console.log('Filesystem adapter initialized')
      if (typeof callback === 'function') callback()
    })
  }

  next(callback) {
    let trackName = this.tracks[Math.floor(Math.random() * this.tracks.length)]
    let file = `${this.tracksDir}/${trackName}`

    ffmpeg.ffprobe(file, (err, data) => {
      if (err) {
        console.log('Error reading track info.', trackName, err)
        return
      }

      let rate = data.format.bit_rate
      let duration = data.format.duration
      let stream = fs.createReadStream(file)
      let name = trackName

      if (data.format.tags && data.format.tags.title) {
        let title = data.format.tags.title
        let artist = data.format.tags.artist
        name = artist ? `${artist} - ${title}` : title
      }

      callback(new Track(stream, name, duration, rate))
    })

  }

}

export default FileSystemAdapter
