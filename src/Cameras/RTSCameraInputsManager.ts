import { ArcRotateCamera, Camera, CameraInputsManager, FilesInputStore, Vector3 } from "@babylonjs/core";
import RTSCameraKeyboardMoveInput from "./Inputs/RTSCameraKeyboardMoveInput";
import RTSCameraMouseWheelInput from "./Inputs/RTSCameraMouseWheelInput";
import RTSCameraPointersInput from "./Inputs/RTSCameraPointersInput";

export class RTSCameraInputsManager extends CameraInputsManager<ArcRotateCamera> {
    /**
     * Instantiates a new RTSCameraInputsManager.
     * @param camera Defines the camera the inputs belong to
     */
    constructor(camera: ArcRotateCamera) {
        super(camera);
        this.camera.speed = 1.0;
        this.camera.upperRadiusLimit = 55;
        this.camera.lowerRadiusLimit = 5;
        this.camera.wheelDeltaPercentage = 550;
        this.camera.panningSensibility = 1000;
        this.camera.panningAxis = new Vector3(1, 0, 1);
    }

    /**
     * Add mouse wheel input support to the input manager.
     * @returns the current input manager
     */
    public addMouseWheel(): RTSCameraInputsManager {
        this.add(new RTSCameraMouseWheelInput())
        return this;
    }

    /**
     * Add pointers input support to the input manager.
     * @returns the current input manager
     */
    public addPointers(): RTSCameraInputsManager {
        this.add(new RTSCameraPointersInput());
        return this;
    }

    /**
     * Add keyboard input support to the input manager.
     * @returns the current input manager
     */
    public addKeyboard(): RTSCameraInputsManager {
        var keyboardInput = new RTSCameraKeyboardMoveInput(this.camera);

        this.camera.storeState();
        keyboardInput.useKeyReset = true;

        this.add(keyboardInput)
        return this;
    }

    public addGamepad(): RTSCameraInputsManager {
        throw new Error("Method not implemented.");
    }
    public addVRDeviceOrientation(): RTSCameraInputsManager {
        throw new Error("Method not implemented.");
    }
}