import { ArcRotateCamera, ArcRotateCameraPointersInput, ICameraInput, Nullable } from "@babylonjs/core";

export default class RTSCameraPointersInput extends ArcRotateCameraPointersInput {
    constructor() {
        super();
        this.panningSensibility = 150;
        this.buttons = [1, 2]
    }
    getClassName(): string {
        return "RTSCameraPointersInput"
    }
    getSimpleName(): string {
        return "pointers"
    }
}