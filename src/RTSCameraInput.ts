import { UniversalCamera } from "@babylonjs/core";
import { ICameraInput } from "./ICameraInput";


export class RTSCameraInput implements ICameraInput<UniversalCamera> {
    camera: UniversalCamera;
    getClassName(): string {
        return "RTSCameraInput";
    }
    getSimpleName(): string {
        return "RTSCameraInput";
    }
    attachControl: (element: HTMLElement, noPreventDefault?: boolean) => void;
    detachControl: (element: HTMLElement) => void;
    checkInputs?: () => void;
}