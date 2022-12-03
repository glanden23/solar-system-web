import * as THREE from 'three'
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

//Like a "level". Lets you place objects.
const app = new THREE.Scene()

//What the client can see.
const viewport = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,.01,20000)

//This is what actually does the rendering for the app.
const render = new THREE.WebGLRenderer({
  canvas: document.querySelector('#app'),
  antialias: true
})

//Loads textures.
const textureLoader = new THREE.TextureLoader()

//!! Anything further is way better explained by the docs (https://threejs.org/docs/index.html) or intellisense (if you are using visual studio code). !!

//Position viewport
viewport.position.setZ(5)
viewport.position.setX(100)

//Setup render
render.setPixelRatio(window.devicePixelRatio)
render.setSize(window.innerWidth,window.innerHeight)

//Light
const ambient = new THREE.AmbientLight( 0xFFFFFF, 0.1 )
app.add( ambient )

const sunLight = new THREE.PointLight( 0xFFFFFF, .5 )
app.add( sunLight )

const sunLight2 = new THREE.SpotLight( 0xFFFFFF, 0.1, undefined, 360 )
app.add( sunLight2 )

//Bloom Credit: https://www.youtube.com/watch?v=ZtK70Tb9uqg
const renderPass = new RenderPass(app, viewport)
const composer = new EffectComposer(render)
composer.addPass(renderPass)

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  .75,
  1.0,
  0.1
)
composer.addPass(bloomPass)

const solarSystem = new THREE.Group()

const sun = new THREE.Mesh(
  new THREE.SphereGeometry( 150, 128, 64),
  new THREE.MeshStandardMaterial( { emissive: 0xFFFF00 } ) 
)
solarSystem.add( sun )

//Textures by: https://www.solarsystemscope.com/textures/
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry( 1, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/mercury/2k_mercury.jpg' ) } ) 
)
mercury.position.setX(230)
solarSystem.add( mercury )

const venus = new THREE.Mesh(
  new THREE.SphereGeometry( 2, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/venus/2k_venus_surface.jpg' ) } ) 
)
venus.position.setX(315)
solarSystem.add( venus )

const mars = new THREE.Mesh(
  new THREE.SphereGeometry( 1.5, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/mars/2k_mars.jpg' ) } ) 
)
mars.position.setX(437)
solarSystem.add( mars )

const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry( 30, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/jupiter/8k_jupiter.jpg' ) } ) 
)
jupiter.position.setX(1427)
solarSystem.add( jupiter )

const saturn = new THREE.Mesh(
  new THREE.SphereGeometry( 27, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/saturn/8k_saturn.jpg' ) } ) 
)
saturn.position.setX(2167)
solarSystem.add( saturn )

const uranus = new THREE.Mesh(
  new THREE.SphereGeometry( 15, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/uranus/2k_uranus.jpg' ) } ) 
)
uranus.position.setX(2487)
solarSystem.add( uranus )

const neptune = new THREE.Mesh(
  new THREE.SphereGeometry( 15, 32, 16),
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/neptune/2k_neptune.jpg' ) } ) 
)
neptune.position.setX(2797)
solarSystem.add( neptune )

//Textures by: https://www.shadedrelief.com/natural3/pages/textures.html
const earthDay = new THREE.Mesh(new THREE.SphereGeometry( 2, 64, 32),new THREE.MeshStandardMaterial({map: textureLoader.load( './textures/earth/2_no_clouds_8k.jpg' )}))
earthDay.position.setX(395)
solarSystem.add( earthDay )

const earthNight = new THREE.Mesh(new THREE.SphereGeometry( 2, 64, 32),new THREE.MeshStandardMaterial({map: textureLoader.load( './textures/earth/5_night_8k.jpg' ),emissiveIntensity: 10}))
earthNight.position.setX(395.01)
earthNight.material.color.setRGB(7,7,7)
solarSystem.add( earthNight )

const earthClouds = new THREE.Mesh(new THREE.SphereGeometry( 2.1, 64, 32),new THREE.MeshPhongMaterial({map: textureLoader.load( './textures/earth/Earth-clouds.png' ),transparent: true}))
earthClouds.position.setX(395.005)
solarSystem.add( earthClouds )

app.add(solarSystem)

const sky = new THREE.Mesh( 
  new THREE.SphereGeometry( 10000, 256, 128), 
  new THREE.MeshStandardMaterial( { map: new THREE.TextureLoader().load( './textures/sky/8k_stars.jpg' ), side: THREE.BackSide } ) 
  )
sky.material.color.setRGB(2,2,2)
app.add( sky )

//Controls
const controls = new OrbitControls(viewport, render.domElement)
controls.enableZoom = false
controls.enablePan = false
controls.autoRotate = true
controls.autoRotateSpeed = 0.01

//Fix rendering when window is resized.
window.addEventListener(
  "resize",
  () => {
    viewport.aspect = window.innerWidth / window.innerHeight
    viewport.updateProjectionMatrix()
    render.setSize(window.innerWidth, window.innerHeight)
    bloomPass.setSize(window.innerWidth, window.innerHeight)
  },
  false
)

const camDir = new THREE.Vector3()
var distance = 10
var target = earthDay

//Allow for size change without breaking orbiting.
addEventListener('wheel', (event) => {
  if (event.deltaY > 0) {
    distance+=5
  }else if(event.deltaY < 0 && distance > 5) {
    distance-=5
  }
});

//https://threejs.org/docs/#api/en/core/Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

//Finds planet where clicked.
function onPointerClick( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( pointer, viewport );
	var intersects = raycaster.intersectObjects( app.children );
	for ( let i = 0; i < intersects.length; i ++ ) {
    var object = intersects[i].object
    if (object.parent.type != "Scene") {
      target = object
    }
  }
}

//Triggers onPointerClick function.
window.addEventListener( "pointerdown", onPointerClick );

//Ran over and over to provide updates.
function loop() {
  
  //Rendering Loop
  requestAnimationFrame(loop)
  composer.render()
  
  //Camera Controller
  target.getWorldPosition( controls.target )
  camDir.subVectors( viewport.position, controls.target )
  camDir.normalize().multiplyScalar( distance )
  viewport.position.copy( camDir.add( controls.target ) )
  controls.update()
  
  //Spinner
  sky.rotation.y+=0.001
  //Spin clouds slightly faster than earth.
  earthClouds.rotation.y+=0.01
  for (var i in solarSystem.children) {
    solarSystem.children[i].rotation.y+=0.01
  }
}
loop()