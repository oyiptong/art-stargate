// ******************************
// Boilerplate to get you started
var scene = new THREE.Scene();

// We're going to use WebGL to render everything (if your browser does not support WebGL you can try the
// CanvasRenderer, although you will be more limited in what you can accomplish)
var renderer = new THREE.WebGLRenderer({ devicePixelRatio:window.devicePixelRatio});
// If you don't have WebGL use the line below.
// var renderer = new THREE.CanvasRenderer()

// Set the size of the renderer so that it fills the entire screen
renderer.setSize( window.innerWidth, window.innerHeight );

// This actually places the renderer on the screen where we will be able to see it
document.body.appendChild( renderer.domElement );

// This creates the camera through which we are going to look at the scene
// The first parameter says that the field of view of this camera will be 75 degrees,
// The second parameter defines the aspect ratio,
// The last two parameters define "clipping planes". We will only render objects that are further
// than the first distance, and closer than the second.
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// End of boilerplate
// *******************************

// Set up the scene in here:

camera.position.z = 5;
var boxGeom = new THREE.BoxGeometry(1, 1, 1);

var cubes = [];
var materials = [];
var numCubes = 1000;
var numWaves = 20;
var cubesPerWave = numCubes/numWaves;

for (var i=0; i < numCubes; i++) {
  var material = new THREE.MeshPhongMaterial({color: 0x0088dd, specular: 0xffffff});
  var cube = new THREE.Mesh(boxGeom, material);
  cube.scale.set(0.05, 0.05, 0.05);
  cubes.push(cube);
  materials.push(material);
  scene.add(cube);
}

var ambientLight = new THREE.AmbientLight(0x010101);
scene.add(ambientLight);

// *********************************
// Configure the animation
//
// This function repeatedly calls the render() function,
// causing an animation

function animate() {
	requestAnimationFrame(animate);
	render();
}

// This function is is called to draw the scene, and do any updates which
// need to happen every frame
var t = 0;
var lineStartLength = 50;

var fpsElem = document.querySelector('#fps');
var startTime = new Date();
var outOfCameraZ = 4;
var previousTime = new Date();
var speed = 2;
var closeness = 5;

function renderFPS(frameNum) {
  var currentTime = new Date();
  var fps = parseInt(t / (currentTime - startTime) * 1000);
  fpsElem.innerHTML = "FPS: " + fps;
}

function render() {
        t++;
        //renderFPS(t);
        var currentTime = new Date();
        var deltaTime = (currentTime-previousTime)/1000;
        update(deltaTime);
	renderer.render(scene, camera);
        previousTime = currentTime;
};

var waveData = [];
for (var i=0; i < numWaves; i++) {
  waveData.push({z: 0, topY: 0, bottomY: 0});
}


function update(deltaTime) {
  var cubeIndex = 0;
  var waveIndex = 0;
  deltaDist = deltaTime * speed;

  while (cubeIndex < numCubes) {
    var waveCubes = cubes.slice(cubeIndex, cubeIndex+cubesPerWave);
    var waveMaterials = materials.slice(cubeIndex, cubeIndex+cubesPerWave);

    var topCubes = waveCubes.slice(0, waveCubes.length/2);
    var topMaterials = waveMaterials.slice(0, waveCubes.length/2);
    var bottomCubes = waveCubes.slice(waveCubes.length/2);
    var bottomMaterials = waveMaterials.slice(waveCubes.length/2);
    var midpoint = waveCubes.length / 4;

    waveDatum = waveData[waveIndex];
    if (waveDatum.z > outOfCameraZ) {
      waveDatum.z = 0;
      waveDatum.topY = 0;
      waveDatum.bottomY = 0;
    }
    else {
      waveDatum.z += deltaDist / (waveIndex+1);
      waveDatum.topY += deltaDist / (waveIndex+1);
      waveDatum.bottomY = waveDatum.topY * -1;
    }


    for (var i=0; i < topCubes.length; i++) {
      var cube = topCubes[i];
      var material = topMaterials[i];
      if (waveDatum.z == 0) {
        material.color.r = Math.floor(Math.random() * 255);
        material.color.g = Math.floor(Math.random() * 255);
        material.color.b = Math.floor(Math.random() * 255);
      }
      cube.position.y = 0.2 * waveDatum.topY;
      cube.position.x = ((lineStartLength/-2) + (lineStartLength/topCubes.length)*i)/closeness + 2* Math.tan(waveIndex*i*0.05);
      cube.position.z =  waveDatum.z;
    }

    for (var i=0; i < bottomCubes.length; i++) {
      var cube = bottomCubes[i];
      var material = bottomMaterials[i];
      if (waveDatum.z == 0) {
        material.color.r = Math.floor(Math.random() * 255);
        material.color.g = Math.floor(Math.random() * 255);
        material.color.b = Math.floor(Math.random() * 255);
      }
      cube.position.y = 0.2 * waveDatum.bottomY;
      cube.position.x = (((lineStartLength/-2) + (lineStartLength/topCubes.length)*i)/closeness + 2* Math.tan(waveIndex*i*0.05)) * -1;
      //cube.position.x = ((lineStartLength/-2) + (lineStartLength/topCubes.length)*i)/closeness * -1;
      cube.position.z = waveDatum.z;
    }
    cubeIndex += cubesPerWave;
    waveIndex += 1;
  }
}

// Start animating!
animate();

