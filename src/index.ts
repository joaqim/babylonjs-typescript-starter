import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { Scene } from "@babylonjs/core/scene"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { SampleMaterial } from "./Materials/SampleMaterial"
import { FPSCameraInputsManager } from "./Cameras/Inputs/CameraKeyboardWalkInput"
import { ArcRotateCamera } from "@babylonjs/core"
import { RTSCameraInputsManager } from "./Cameras/RTSCameraInputsManager"

const view = document.getElementById("view") as HTMLCanvasElement
const engine = new Engine(view, true)

const scene = new Scene(engine)

const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3.2,
    2,
    Vector3.Zero(),
    scene)
camera.useAutoRotationBehavior = false;
camera.panningAxis = new Vector3(1, 0, 1);
camera._panningMouseButton = 1;
//camera.inputs.clear();
//camera.inputs.addPointers();
camera.inputs = new RTSCameraInputsManager(camera);
camera.inputs.addMouseWheel().addPointers().addKeyboard();

//const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 10, 0), scene);

// Targets the camera to a particular position. In this case the scene origin
camera.setTarget(Vector3.Zero());

//camera.inputs.clear();
//camera.inputs.add(new RTSCameraInput());

camera.attachControl(view)

const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene)

const mesh = MeshBuilder.CreateGround("mesh", {}, scene)

const material = new SampleMaterial("material", scene)
mesh.material = material

engine.runRenderLoop(() => {
    scene.render();
})
