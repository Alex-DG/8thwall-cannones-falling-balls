import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

import Lights from '../classes/Lights'
import CannonWorld from '../classes/CannonWorld'

export const initWorldPipelineModule = () => {
  const pane = new Pane()
  pane.registerPlugin(EssentialsPlugin)
  const fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'fps',
  })

  const init = () => {
    Lights.init()
    CannonWorld.init()

    console.log('✨', 'World ready')
  }

  const render = () => {
    fpsGraph.begin()

    CannonWorld?.update()

    fpsGraph.end()
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onRender: () => render(),
  }
}
