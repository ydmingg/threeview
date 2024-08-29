import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

import { Emitter } from "../util";
import { Events } from "../types";

export default class Loader { 
    gltf_loader: GLTFLoader;
    texture_loader: THREE.TextureLoader;
    audio_loader: THREE.AudioLoader;
    emitter: Emitter;
    constructor() { 
        this.emitter = new Emitter();
        this.gltf_loader = new GLTFLoader();
        this.texture_loader = new THREE.TextureLoader();
        this.audio_loader = new THREE.AudioLoader();
            
        // 触发事件
        THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
            this.emitter.$emit(Events.ON_LOAD_PROGRESS, { url, loaded, total });
            
		};
    

    }
}