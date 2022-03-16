import { ArcRotateCamera, ArcRotateCameraPointersInput, ICameraInput, Nullable } from "@babylonjs/core";

export default class RTSCameraPointersInput extends ArcRotateCameraPointersInput {
    constructor() {
        super();
    }
    getClassName(): string {
        return "RTSCameraPointersInput"
    }
    getSimpleName(): string {
        return "pointers"
    }
}