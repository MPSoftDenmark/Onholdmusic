import Radio from './radio'
import Adapter from './file-system'
import socketIO from 'socket.io'

let init = (server, config) => {

  let socket = socketIO(server)
  let adapter = new Adapter(config.paths.media)

  return new Radio(adapter, socket)
}

export default init
