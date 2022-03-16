import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { ArcRotateCamera, Engine, FlyCamera, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { RTSCameraInputsManager } from "./Cameras/RTSCameraInputsManager";
import { DynamicTerrain } from "./Extensions/babylon.dynamicTerrain";

import SimplexNoise from 'simplex-noise'

var addSphere = (scene: Scene, diameter = 1) =>
  MeshBuilder.CreateSphere("sphere", { diameter }, scene);

var addLight = (scene: Scene, direction: Vector3 = new Vector3(1, 1, 0)) => new HemisphericLight("light1", direction, scene);
var genTerrain = (scene: Scene) => {

  //var ground: Mesh = MeshBuilder.CreateGroundFromHeightMap("ground", "./assets/heightMap.png", { width: 8, height: 8, subdivisions: 128, maxHeight: 1 }, scene);

  // map creation
  var mapSubX = 10;
  var mapSubZ = 10;
  var mapData = new Float32Array(mapSubX * mapSubZ * 3);
  for (var l = 0; l < mapSubZ; l++) {
    for (var w = 0; w < mapSubX; w++) {
      mapData[3 * (l * mapSubX + w)] = (w - mapSubX * 0.5) * 2.0;
      mapData[3 * (l * mapSubX + w) + 1] = w / (l + 1) * Math.sin(l / 2) * Math.cos(w / 2) * 2.0;
      mapData[3 * (l * mapSubX + w) + 2] = (l - mapSubZ * 0.5) * 2.0;
    }
  }
  // terrain creation
  var terrainSub = 50;
  var params = {
    mapData: mapData,
    mapSubX: mapSubX,
    mapSubZ: mapSubZ,
    terrainSub: terrainSub
  };
  return new DynamicTerrain("terrain", params, scene);
}

var genNoiseTerrain = (scene: Scene) => {
  var mapSubX = 640;             // map number of points on the width
  var mapSubZ = 640;              // map number of points on the height
  var seed = 0.3;                 // set the noise seed
  var simplex = new SimplexNoise(seed);
  var mapData = new Float32Array(mapSubX * mapSubZ * 3);  // x3 because 3 values per point : x, y, z

  for (var l = 0; l < mapSubZ; l++) {                 // loop on height points
    for (var w = 0; w < mapSubX; w++) {             // loop on width points
      var x = (w - mapSubX * 0.5) * 5.0;          // distance inter-points = 5 on the width
      var z = (l - mapSubZ * 0.5) * 2.0;          // distance inter-points = 2 on the width
      var y = simplex.noise2D(x, z);               // altitude

      mapData[3 * (l * mapSubX + w)] = x;
      mapData[3 * (l * mapSubX + w) + 1] = y;
      mapData[3 * (l * mapSubX + w) + 2] = z;
    }
  }
  var terrainSub = 30;               // 100 terrain subdivisions
  var params = {
    mapData: mapData,               // data map declaration : what data to use ?
    mapSubX: mapSubX,               // how are these data stored by rows and columns
    mapSubZ: mapSubZ,
    terrainSub: terrainSub          // how many terrain subdivisions wanted
  }
  return new DynamicTerrain("t", params, scene);
}

export default class App {
  constructor() {
    const canvas = document.getElementById("view") as HTMLCanvasElement

    // initialize babylon scene and engine
    var engine = new Engine(canvas, true);
    var scene = new Scene(engine);

    var sphere = addSphere(scene)

    var camera = new ArcRotateCamera("Camera", (Math.PI / 2), (Math.PI / 4), 15, Vector3.Zero(), scene);
    camera.setTarget(sphere);
    //sphere.getAbsolutePosition();
    //var camera = new FreeCamera("Camera", new Vector3(0, 0, -10), scene);
    //var camera = new UniversalCamera("Camera");
    camera.inputs = new RTSCameraInputsManager(camera);
    camera.inputs.addMouseWheel().addPointers().addKeyboard();
    camera.attachControl(canvas);

    addLight(scene)

    //var terrain = genTerrain(scene);
    var terrain = genNoiseTerrain(scene);

    var camElevation = 2.0;
    var camAltitude = 0.0;
    // Terrain camera altitude clamp
    scene.registerBeforeRender(function () {
      camAltitude = terrain.getHeightFromMap(camera.position.x, camera.position.z) + camElevation;
      camera.position.y = camAltitude;
    });

    // Terrain camera LOD : custom function
    /*
    terrain.updateCameraLOD = function (terrainCamera) {
      // LOD value increases with camera altitude
      return Math.abs((terrainCamera.globalPosition.y / 36.0) | 0);
    };
    */


    var debugCamera = new FlyCamera("DebugCamera", new Vector3(0, 0, 10.0), scene, false);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Ctrl+Alt+A
      if (ev.ctrlKey && ev.altKey && ev.code === "KeyA") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }

    });

    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}
