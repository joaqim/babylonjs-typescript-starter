import { ArcRotateCamera, Camera, Engine, ICameraInput, KeyboardEventTypes, Nullable, Scene, Tools, Vector2 } from "@babylonjs/core";

export default class RTSCameraKeyboardMoveInput implements ICameraInput<ArcRotateCamera> {
    camera: ArcRotateCamera;
    private _onCanvasBlurObserver: any;
    private _scene: Nullable<Scene> = null;
    private _engine: Nullable<Engine> = null;

    private _onKeyboardObserver: any;

    keysUp: number[] = [38, 188];
    keysDown: number[] = [40, 79];
    keysLeft: number[] = [37, 65]
    keysRight: number[] = [39, 69]

    keysFly: number[] = [190];
    keysSink: number[] = [186];

    keysReset: number[] = [80];

    panningSensibility: number = 20.0;
    zoomingSensibility: number = 25.0;
    angularSpeed: number = 0.01;
    private _maxInertiaPanning = 40;

    useAltToZoom: boolean = false;
    useKeyReset: boolean = false;

    private _keys: number[] = Array();
    private _shiftPressed: boolean = false;
    private _ctrlPressed: boolean = false;


    constructor(camera: ArcRotateCamera) {
        this.camera = camera;

        this.camera.storeState();
        this.useKeyReset = true;
    }

    getClassName(): string {
        return "RTSCameraKeyboardWalkInput"
    }
    getSimpleName(): string {
        return "keyboard"
    }

    attachControl(noPreventDefault?: boolean): void {
        var _this = this;
        if (this._onCanvasBlurObserver) {
            return;
        }
        this._scene = this.camera!.getScene();
        this._engine = this._scene.getEngine();
        this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(function () {
            _this._keys = [];
        });
        this._onKeyboardObserver = this._scene.onKeyboardObservable.add(function (info: any) {
            var evt = info.event;
            if (!evt.metaKey) {
                var keyCode = evt.keyCode;
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    _this._ctrlPressed = evt.ctrlKey;
                    _this._shiftPressed = evt.shiftKey;
                    if (hasKey(keyCode)) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index === -1) {
                            _this._keys.push(evt.keyCode);
                        }
                        if (evt.preventDefault) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                }
                else {
                    if (hasKey(keyCode)) {
                        var index = _this._keys.indexOf(evt.keyCode);
                        if (index >= 0) {
                            _this._keys.splice(index, 1);
                        }
                        if (evt.preventDefault) {
                            if (!noPreventDefault) {
                                evt.preventDefault();
                            }
                        }
                    }
                }
            }
        });

        const hasKey = (keyCode: any) => {
            return _this.keysUp.indexOf(keyCode) !== -1 || _this.keysDown.indexOf(keyCode) !== -1 || _this.keysLeft.indexOf(keyCode) !== -1 || _this.keysRight.indexOf(keyCode) !== -1 || _this.keysReset.indexOf(keyCode) !== -1 || _this.keysFly.indexOf(keyCode) !== -1 || _this.keysSink.indexOf(keyCode) !== -1;
        };
    }
    detachControl(): void {
        if (this._scene) {
            if (this._onKeyboardObserver) {
                this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }
            if (this._onCanvasBlurObserver) {
                this._engine!.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
            this._onKeyboardObserver = null;
            this._onCanvasBlurObserver = null;
        }
        this._keys = [];
    }
    checkInputs(): void {
        //NOTE: var panningSensibilityYDelta is used to
        //      increase speed on Y axis to account for 
        //      'MapPanning' where only X & Z  are kept after
        //      transformation with X & Y inertial panning
        //NOTE: Unexpected behaviours when beta is too close to 0

        if (this._onKeyboardObserver) {
            var camera = this.camera;
            var panningSensibilityYDelta = Tools.ToRadians(35) / this.camera.beta;
            var panSpeed = (1 / this.panningSensibility) * Math.max(0.25, (this.camera.radius / 55))
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                if(this._shiftPressed) {
                    panSpeed *= 2.0;
                    panningSensibilityYDelta
                }
                if (this.keysUp.indexOf(keyCode) !== -1) {
                    camera.inertialPanningY += Math.min(panSpeed * panningSensibilityYDelta, this._maxInertiaPanning)
                } else if (this.keysDown.indexOf(keyCode) !== -1) {
                    camera.inertialPanningY -= Math.min(panSpeed * panningSensibilityYDelta, this._maxInertiaPanning)
                } else if (this.keysLeft.indexOf(keyCode) !== -1) {
                    camera.inertialPanningX -= Math.min(panSpeed, this._maxInertiaPanning)
                } else if (this.keysRight.indexOf(keyCode) !== -1) {
                    camera.inertialPanningX += Math.min(panSpeed, this._maxInertiaPanning)
                } else if (this.keysSink.indexOf(keyCode) !== -1) {
                    camera.target.y -= 0.2
                } else if (this.keysFly.indexOf(keyCode) !== -1) {
                    camera.target.y += 0.2
                } else if (this.keysReset.indexOf(keyCode) !== -1 && this.useKeyReset) {
                    camera.restoreState();
                }
            }
        }
    }
}

