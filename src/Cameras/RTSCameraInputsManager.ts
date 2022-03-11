import { ArcRotateCamera, ArcRotateCameraMouseWheelInput, CameraInputsManager } from "@babylonjs/core";

 export class RTSCameraInputsManager extends CameraInputsManager<ArcRotateCamera> {
    /**
     * Instantiates a new ArcRotateCameraInputsManager.
     * @param camera Defines the camera the inputs belong to
     */
    constructor(camera: ArcRotateCamera) {
        super(camera);
    }

    /**
     * Add mouse wheel input support to the input manager.
     * @returns the current input manager
     */
    public addMouseWheel(): RTSCameraInputsManager {
        var mouseWheelInput = new ArcRotateCameraMouseWheelInput()
        mouseWheelInput.camera.upperRadiusLimit = 50;
        mouseWheelInput.camera.lowerRadiusLimit = 1;
        this.add(mouseWheelInput);
        return this;
    }

    /**
     * Add pointers input support to the input manager.
     * @returns the current input manager
     */
    public addPointers(): RTSCameraInputsManager {
        //this.add(new RTSCameraPointersInput());
        return this;
    }

    /**
     * Add keyboard input support to the input manager.
     * @returns the current input manager
     */
    public addKeyboard(): RTSCameraInputsManager {
        //this.add(new RTSKeyboardMoveInput());
        return this;
    }

    public addGamepad(): RTSCameraInputsManager {
        throw new Error("Method not implemented.");
    }
    public addVRDeviceOrientation(): RTSCameraInputsManager {
        throw new Error("Method not implemented.");
    }
}