import Lights from '../classes/Lights'
import CannonWorld from '../classes/CannonWorld'

export const initWorldPipelineModule = () => {
  let stats

  const init = () => {
    Lights.init()
    CannonWorld.init()

    stats = new Stats()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

    console.log('✨', 'World ready')
  }

  const render = () => {
    stats?.begin()

    CannonWorld?.update()

    stats?.end()
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onRender: () => render(),
  }
}
