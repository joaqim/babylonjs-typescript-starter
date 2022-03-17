import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { ArcRotateCamera, Color3, DirectionalLight, Engine, FlyCamera, FreeCamera, HemisphericLight, Material, MeshBuilder, PBRBaseSimpleMaterial, PBRMaterial, PBRMetallicRoughnessMaterial, Scene, ShadowGenerator, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { RTSCameraInputsManager } from "./Cameras/RTSCameraInputsManager";
import { DynamicTerrain } from "./Extensions/babylon.dynamicTerrain";
import ground_texture from "../public/assets/ground.jpg"

import SimplexNoise from 'simplex-noise'

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

var addSphere = (scene: Scene, diameter = 1) =>
  MeshBuilder.CreateSphere("sphere", { diameter }, scene);

var addLight = (scene: Scene, direction: Vector3 = new Vector3(1, 1, 0)) => {
  var light = new HemisphericLight("light1", direction, scene);
  light.intensity = 0.7;
  return light;
};

var genTerrain = (scene: Scene) => {
  const mapSubX = 64;              // map number of points on the width
  const mapSubZ = 64;              // map number of points on the height
  const seed = 0.3;                 // set the noise seed
  const noiseScale = 0.03;
  const elevationScale = 3.0;
  var simplex = new SimplexNoise(seed);
  var mapColors = new Float32Array(mapSubX * mapSubZ * 3);
  var mapData = new Float32Array(mapSubX * mapSubZ * 3);  // x3 because 3 values per point : x, y, z

  for (var l = 0; l < mapSubZ; l++) {                 // loop on height points
    for (var w = 0; w < mapSubX; w++) {             // loop on width points
      var x = (w - mapSubX * 0.5) * 2.0;          // distance inter-points 
      var z = (l - mapSubZ * 0.5) * 2.0;          // distance inter-points 
      var y = simplex.noise2D(x * noiseScale, z * noiseScale);               // altitude
      y *= (0.5 + y) * y * elevationScale; // increase elevation from noise value

      const index = 3 * (l * mapSubX + w);

      mapData[index] = x;
      mapData[index + 1] = y;
      mapData[index + 2] = z;

      // Colors
      mapColors[index] = (0.5 + Math.random() * 0.2);
      mapColors[index + 1] = (0.5 + Math.random() * 0.4);
      mapColors[index + 2] = (0.5);
    }
  }
  const terrainSub = 100;

  

  var params = {
    //mapColors,
    mapData,               // data used for the map
    mapSubX,               // how are these data stored by rows and columns
    mapSubZ,
    terrainSub,                 // how many terrain subdivisions wanted
  }
  var terrain = new DynamicTerrain("t", params, scene);
  terrain.createUVMap()
  // Only update terrain subdivisions when X tiles are crossed
  terrain.subToleranceX = 10
  terrain.subToleranceZ = 10

  terrain.isAlwaysVisible = true;

  var terrainTexture = new Texture(ground_texture, scene);
  terrainTexture.uScale = 4.0;
  terrainTexture.vScale = terrainTexture.uScale;

  var terrainMaterial = new StandardMaterial("TerrainMaterial", scene)
  terrainMaterial.diffuseTexture = terrainTexture
  terrainMaterial.specularColor = new Color3(0,0,0)

  terrain.mesh.material = terrainMaterial
  /*
  terrain.updateVertex = function (vertex, i, j) {
    if (vertex.position.y > 2.0) {
      vertex.color.r = 1.0;
      vertex.color.b = 0.2;
    }
  };*/

  terrain.update(true)

  return terrain;
}

export default class App {
  constructor() {
    const canvas = document.getElementById("view") as HTMLCanvasElement

    // initialize babylon scene and engine
    var engine = new Engine(canvas, true);
    var scene = new Scene(engine);

    var sphere = addSphere(scene)

    var camera = new ArcRotateCamera("Camera", 0, (Math.PI / 5), 35, Vector3.Zero(), scene);
    //camera.setTarget(sphere);
    camera.setTarget(Vector3.Zero());
    //sphere.getAbsolutePosition();
    //var camera = new FreeCamera("Camera", new Vector3(0, 0, -10), scene);
    //var camera = new UniversalCamera("Camera");
    camera.inputs = new RTSCameraInputsManager(camera);
    camera.inputs.addMouseWheel().addPointers().addKeyboard();
    camera.attachControl(canvas);

    addLight(scene)

    //var terrain = genTerrain(scene);
    var terrain = genTerrain(scene);

    /*
    var terrainMaterial = new StandardMaterial("materialGround", scene);
    terrainMaterial.diffuseColor = new Color3(0.89, 0.50, 0.34);
    terrainMaterial.specularColor = new Color3(0, 0, 0)
    //terrainMaterial.roughness = 1.0

    terrain.mesh.material = terrainMaterial;
    */

    var light = new DirectionalLight("dir01", new Vector3(-1, -2, -1), scene);
    light.position = new Vector3(20, 40, 20);
    light.intensity = 0.5;

    /*
    var shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.addShadowCaster(sphere)
    shadowGenerator.useExponentialShadowMap = true;
    terrain.mesh.receiveShadows = true;
    */

    /*
    var camElevation = 2.0;
    var camAltitude = 0.0;
    // Terrain camera altitude clamp
    scene.registerBeforeRender(function () {
      camAltitude = terrain.getHeightFromMap(camera.position.x, camera.position.z) + camElevation;
      camera.position.y = camAltitude;
    });
    */

    /*
    // Terrain camera LOD : custom function
    terrain.updateCameraLOD = function (terrainCamera: ArcRotateCamera) {
      // LOD value increases with camera altitude
      //return Math.abs((terrainCamera.globalPosition.y / 36.0) | 0);
      return Math.abs((terrainCamera.radius / 50.0) | 0)
    };
    */


    //var debugCamera = new FlyCamera("DebugCamera", new Vector3(0, 0, 10.0), scene, false);

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
