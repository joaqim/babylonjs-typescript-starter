import { ArcRotateCamera, Camera, CameraInputsManager } from "@babylonjs/core";
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
        this.camera.upperRadiusLimit = 25;
        this.camera.lowerRadiusLimit = 5;
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
        this.add(new RTSCameraKeyboardMoveInput(this.camera));
        return this;
    }

    public addGamepad(): RTSCameraInputsManager {
        throw new Error("Method not implemented.");
    }
    public addVRDeviceOrientation(): RTSCameraInputsManager {
        throw new Error("Method not implemented.");
    }
}