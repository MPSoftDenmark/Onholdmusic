import Stream from 'stream'
import Throttle from 'throttle'

class Track extends Stream.Writable {

  constructor(stream, name, duration, rate) {
    super()

    this.inputStream = stream
    this.name = name
    this.duration = duration
    this.rate = rate

    this.inputStream.on('end', () => this.emit('end'))
  }

  _write(data, encoding, callback) {
    this._chunk = data
    this.emit('data', data)
    callback()
  }

  play() {
    let throttle = new Throttle(this.rate / 8)
    this.inputStream.pipe(throttle).pipe(this)
    this.startTime = new Date()

    setInterval(() => this.elapsed++, 1000)
  }

  _export() {
    return {
      name: this.name,
      duration: this.duration,
      elapsed: this.elapsed,
      startTime: this.startTime
    }
  }

}

export default Track
