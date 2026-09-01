import mitt from 'mitt'

type Events = {
  logout: void
  login: string
  'theme-change': string
}

const emitter = mitt<Events>()

export default emitter