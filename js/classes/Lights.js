import * as THREE from 'three'

class _Lights {
  init() {
    const { scene } = XR8.Threejs.xrScene()
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 1, 0)

    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 512
    directionalLight.shadow.mapSize.height = 512

    scene.add(directionalLight)
  }
}

const Lights = new _Lights()
export default Lights
