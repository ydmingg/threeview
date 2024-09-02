import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Events } from "../types";
import { Stage } from "../stage";

export class Loader { 
    private _otps: any;
    private _stage: Stage;
    gltf_loader: GLTFLoader;
	texture_loader: THREE.TextureLoader;
	audio_loader: THREE.AudioLoader;

    constructor(otps: any) { 
        this._otps = otps
        this._stage = new Stage(this._otps);
		this.gltf_loader = new GLTFLoader();
		this.texture_loader = new THREE.TextureLoader();
		this.audio_loader = new THREE.AudioLoader();

        THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
			this._stage.$emit(Events.ON_LOAD_PROGRESS, {url, loaded, total});
		};

    }

    
}