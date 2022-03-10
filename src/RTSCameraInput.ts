import { Camera, ICameraInput, Tools, UniversalCamera, Vector3 } from "@babylonjs/core";


export class RTSCameraInput implements ICameraInput<UniversalCamera> {

    attachControl(noPreventDefault?: boolean): void {
        throw new Error("Method not implemented.");
    }
    detachControl(): void {
        throw new Error("Method not implemented.");
    }

    camera: UniversalCamera;

    getClassName(): string {
        return "RTSCameraInput";
    }
    getSimpleName(): string {
        return "RTSCameraInput";
    }


    checkInputs?(): void;
}

RTSCameraInput.prototype.checkInputs = function () {
    if (this._onKeyDown) {
        // Keyboard
        for (var index = 0; index < this._keys.length; index++) {
            var keyCode = this._keys[index];
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                this.camera.cameraRotation.y += this.sensibility;
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                this.camera.cameraRotation.y -= this.sensibility;
            }
        }
    }
}


export class FreeCameraKeyboardWalkInput implements ICameraInput<UniversalCamera> {

    camera: UniversalCamera;

    keysUp:  string[];
    keysDown: string[];
    keysLeft: string[];
    keysRight: string[];
    _keys: string[];

    _onKeyDown: (evt: KeyboardEvent) => void;
    _onKeyUp: (evt: KeyboardEvent) => void;

    constructor() {
        this._keys = [];
        this.keysUp = ["KeyW", "ArrowUp"];
        this.keysDown = ["KeyS", "ArrowDown"];
        this.keysLeft = ["KeyA", "ArrowLeft"];
        this.keysRight = ["KeyD", "ArrowRight"];
    }

    getClassName(): string {
        return "FreeCameraKeyboardWalkInput"
    }
    getSimpleName(): string {
        return "keyboard"
    }

    attachControl(noPreventDefault?: boolean): void {
        var _this = this;
        var engine = this.camera.getEngine();
        var element = engine.getInputElement();
        if (!this._onKeyDown) {
            element.tabIndex = 1;
            this._onKeyDown = function (evt: KeyboardEvent) {
                if (_this.keysUp.indexOf(evt.code) !== -1 ||
                    _this.keysDown.indexOf(evt.code) !== -1 ||
                    _this.keysLeft.indexOf(evt.code) !== -1 ||
                    _this.keysRight.indexOf(evt.code) !== -1) {
                    var index = _this._keys.indexOf(evt.code);
                    if (index === -1) {
                        _this._keys.push(evt.code);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this._onKeyUp = function (evt: KeyboardEvent) {
                if (_this.keysUp.indexOf(evt.code) !== -1 ||
                    _this.keysDown.indexOf(evt.code) !== -1 ||
                    _this.keysLeft.indexOf(evt.code) !== -1 ||
                    _this.keysRight.indexOf(evt.code) !== -1) {
                    var index = _this._keys.indexOf(evt.code);
                    if (index >= 0) {
                        _this._keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            element.addEventListener("keydown", this._onKeyDown, false);
            element.addEventListener("keyup", this._onKeyUp, false);
        }
    };

    detachControl(): void {
        var engine = this.camera.getEngine();
        var element = engine.getInputElement();
        if (this._onKeyDown) {
            element.removeEventListener("keydown", this._onKeyDown);
            element.removeEventListener("keyup", this._onKeyUp);
            Tools.UnregisterTopRootEvents(engine.getHostWindow(), [
                { name: "blur", handler: this._onLostFocus }
            ]);
            this._keys = [];
            this._onKeyDown = null;
            this._onKeyUp = null;
        }
    }

    _onLostFocus(e: FocusEvent): void {
        this._keys = [];
    }

    checkInputs() {
        if (this._onKeyDown) {
            var camera = this.camera;
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                var speed = camera.speed;
                if (this.keysUp.indexOf(keyCode) !== -1) {
                    camera.cameraDirection.copyFromFloats(0, 0, speed);
                }
                else if (this.keysDown.indexOf(keyCode) !== -1) {
                    camera.cameraDirection.copyFromFloats(0, 0, -speed);
                }
                else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera.rotation.y += camera.angularSensibility;
                    camera.cameraDirection.copyFromFloats(0, 0, 0);
                }
                else if (this.keysLeft.indexOf(keyCode) !== -1) {
                    camera.rotation.y -= camera.angularSensibility;
                    camera.cameraDirection.copyFromFloats(0, 0, 0);
                }
                
                if (camera.getScene().useRightHandedSystem) {
                    camera.cameraDirection.z *= -1;
                }
                camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
                Vector3.TransformNormalToRef(camera.cameraDirection, camera._cameraTransformMatrix, camera._transformedDirection);
                camera.cameraDirection.addInPlace(camera._transformedDirection);
            }
        }
    }
}