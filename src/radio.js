import Listener from './listener'

class Radio {

  constructor(adapter, socket) {
    this.adapter = adapter
    this.socket = socket
    this.listeners = []
    this.listenersCount = 0

    this.init()
  }

  init() {
    this.adapter.loadTracks(() => {
      console.log('Radio initialized')
      this._next()
    })
  }

  addListener(req, res) {
    let listener = new Listener(res)

    this.listeners.push(listener)
    this.listenersCount++

    console.log(`Listener ${listener.id} connected. Total: ${this.listenersCount}`)
    return listener
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((item) => item.id !== listener.id)
    this.listenersCount--
    console.log(`Listener ${listener.id} disconnected. Total: ${this.listenersCount}`)
  }

  _next() {
    this.adapter.next((track) => {
      this.currentTrack = track

      this.currentTrack.on('data', this.onRead.bind(this))
      this.currentTrack.on('end', this.onEnd.bind(this))

      track.play()

      this.socket.emit('track', track._export())
      console.log(`Next track ${track.name}`)
    })
  }

  onRead(data) {
    this.listeners.forEach((listener) => listener.send(data))
  }

  onEnd() {
    setTimeout(() => {
      this.currentTrack = null
      delete this.currentTrack
      this._next()
    }, 1000)
  }
}

export default Radio
