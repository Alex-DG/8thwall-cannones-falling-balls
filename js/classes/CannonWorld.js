import * as CANNON from 'cannon-es'
import * as THREE from 'three'

class _CannonWorld {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  setWorld() {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0),
    })
  }

  setObjects() {
    const groundGeo = new THREE.PlaneGeometry(10, 10)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    })
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat)
    this.groundMesh.d
    this.groundMesh.receiveShadow = true
    this.scene.add(this.groundMesh)
  }

  setBody() {
    // Ground body
    this.groundPhysMat = new CANNON.Material()
    this.groundBody = new CANNON.Body({
      // new CANNON.Plane(), plane is infinite to make objects falling down you need a box shape
      // mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(0, 0, 0),
      material: this.groundPhysMat,
    })
    this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    this.world.addBody(this.groundBody)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  onTouchScreen(e) {
    if (e.touches.length > 2) return

    // If the canvas is tapped with one finger and hits the "surface", spawn an object.

    // calculate tap position in normalized device coordinates (-1 to +1) for both components.
    this.tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    this.tapPosition.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1

    this.planeNormal.copy(this.camera.position).normalize()
    this.plane.setFromNormalAndCoplanarPoint(
      this.planeNormal,
      this.scene.position
    )
    this.raycaster.setFromCamera(this.tapPosition, this.camera)
    this.raycaster.ray.intersectPlane(this.plane, this.intersectionPoint)

    this.onAddSphere()
  }

  onAddSphere() {
    // Create mesh
    const sphereMat = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      metalness: 0.05,
      roughness: 0,
    })

    const sphereMesh = new THREE.Mesh(this.sphereGeo, sphereMat)
    sphereMesh.castShadow = true
    sphereMesh.position.copy(this.intersectionPoint)

    this.scene.add(sphereMesh)

    // Create Body
    const point = this.intersectionPoint
    const spherePhysMat = new CANNON.Material()
    const sphereBody = new CANNON.Body({
      mass: 0.3,
      shape: new CANNON.Sphere(0.125), // same as sphere geometry
      position: new CANNON.Vec3(point.x, point.y, point.z),
      material: spherePhysMat,
    })
    this.world.addBody(sphereBody)

    this.meshes.push(sphereMesh)
    this.bodies.push(sphereBody)

    const planeSphereContactMat = new CANNON.ContactMaterial(
      this.groundPhysMat,
      spherePhysMat,
      {
        restitution: 0.5,
      }
    )
    this.world.addContactMaterial(planeSphereContactMat)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  bind() {
    this.onTouchScreen = this.onTouchScreen.bind(this)
  }

  init() {
    const { scene, camera } = XR8.Threejs.xrScene()

    this.scene = scene
    this.camera = camera

    this.timeStep = 1 / 60

    this.tapPosition = new THREE.Vector2()
    this.intersectionPoint = new THREE.Vector3()
    this.planeNormal = new THREE.Vector3()
    this.raycaster = new THREE.Raycaster()

    this.plane = new THREE.Plane()

    this.meshes = []
    this.bodies = []

    this.sphereGeo = new THREE.SphereGeometry(0.125, 30, 30)

    this.bind()

    this.setWorld()
    this.setObjects()
    this.setBody()

    window.addEventListener('touchstart', this.onTouchScreen, true)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  destroyMesh(mesh, body, index) {
    if (mesh.position.y <= 0) {
      // Remove the mesh from the array
      this.meshes.splice(index, 1)
      this.bodies.splice(index, 1)

      // Remove the mesh from the scene
      this.scene.remove(mesh)
      this.world.removeBody(body)

      // Dispose of its resources
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
  }

  updateMeshes() {
    this.meshes.forEach((mesh, index) => {
      const body = this.bodies[index]
      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
      this.destroyMesh(mesh, body, index)
    })
  }

  updateGround() {
    this.groundMesh?.position.copy(this.groundBody.position)
    this.groundMesh?.quaternion.copy(this.groundBody.quaternion)
  }

  update() {
    this.world?.step(this.timeStep)

    this.updateGround()
    this.updateMeshes()
  }
}

const CannonWorld = new _CannonWorld()
export default CannonWorld
