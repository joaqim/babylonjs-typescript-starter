import { ArcRotateCamera, Camera, Engine, ICameraInput, KeyboardEventTypes, Nullable, Scene, Tools } from "@babylonjs/core";

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

    keysReset: number[] = [220];

    panningSensibility: number = 50.0;
    zoomingSensibility: number = 25.0;
    angularSpeed: number = 0.01;

    useAltToZoom: boolean = false;

    private _keys: number[] = Array();
    private _shiftPressed: boolean = false;
    private _ctrlPressed: boolean = false;

    constructor(camera: ArcRotateCamera) {
        this.camera = camera;
    }

    getClassName(): string {
        return "RTSCameraKeyboardWalkInput"
    }
    getSimpleName(): string {
        return "keyboard"
    }

    attachControl(noPreventDefault?: boolean): void {
        var _this = this;
        // was there a second variable defined?
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
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
                if (info.type === KeyboardEventTypes.KEYDOWN) {
                    _this._ctrlPressed = evt.ctrlKey;
                    _this._shiftPressed = evt.shiftKey;
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 || _this.keysDown.indexOf(evt.keyCode) !== -1 || _this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysReset.indexOf(evt.keyCode) !== -1) {
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
                    if (_this.keysUp.indexOf(evt.keyCode) !== -1 || _this.keysDown.indexOf(evt.keyCode) !== -1 || _this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysReset.indexOf(evt.keyCode) !== -1) {
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
        if (this._onKeyboardObserver) {
            var camera = this.camera;
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                if (this.keysUp.indexOf(keyCode) !== -1) {
                    //camera.inertialBetaOffset -= this.angularSpeed;
                    //camera.inertialPanningY += 1 / this.panningSensibility;
                    //camera.position.x -= 1 / this.panningSensibility;
                    camera.position.x += 1000.0;
                } else if (this.keysDown.indexOf(keyCode) !== -1) {
                    //camera.inertialBetaOffset += this.angularSpeed;
                    //camera.inertialPanningY -= 1 / this.panningSensibility;
                    //camera.position.x += 1 / this.panningSensibility;
                } else if (this.keysLeft.indexOf(keyCode) !== -1) {
                    //camera.inertialAlphaOffset -= this.angularSpeed;
                    camera.inertialPanningX -= 1 / this.panningSensibility;
                } else if (this.keysRight.indexOf(keyCode) !== -1) {
                    //camera.inertialAlphaOffset += this.angularSpeed;
                    camera.inertialPanningX += 1 / this.panningSensibility;
                } else if (this.keysSink.indexOf(keyCode) !== -1) {
                    camera.inertialPanningY += 1 / this.panningSensibility;
                } else if (this.keysFly.indexOf(keyCode) !== -1) {
                    camera.inertialPanningY -= 1 / this.panningSensibility;
                } else if (this.keysReset.indexOf(keyCode) !== -1) {
                    if (camera.useInputToRestoreState) {
                        camera.restoreState();
                    }
                } else if (this.keysReset.indexOf(keyCode) !== -1) {
                    if (camera.useInputToRestoreState) {
                        camera.restoreState();
                    }
                }
            }
        }
    }
}
