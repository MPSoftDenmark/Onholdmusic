class Listener {

  constructor(response) {
    this.id = this.uniqueId()
    this.response = response
    this._writeHead()
  }

  send(data) {
    this.response.write(data)
  }

  _writeHead() {
    this.response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache'
    })
  }

  uniqueId() {
    return 'xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}

export default Listener
