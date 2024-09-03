import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { Events } from "../types";
import { Stage } from "../stage";

export class Loader { 
    private _opts: any;
    private _stage: Stage;
    gltf_loader: GLTFLoader;
    obj_loader: OBJLoader;
    stl_loader: STLLoader;
    fbx_loader: FBXLoader;
    dae_loader: ColladaLoader;
    tds_loader: TDSLoader;
    mtl_loader: MTLLoader;
	texture_loader: THREE.TextureLoader;
	audio_loader: THREE.AudioLoader;

    constructor(opts: any) { 
        this._opts = opts
        this._stage = new Stage(this._opts);
		this.gltf_loader = new GLTFLoader();
		this.obj_loader = new OBJLoader();
		this.stl_loader = new STLLoader();
		this.fbx_loader = new FBXLoader();
		this.dae_loader = new ColladaLoader();
		this.tds_loader = new TDSLoader();
		this.mtl_loader = new MTLLoader();
		this.texture_loader = new THREE.TextureLoader();
		this.audio_loader = new THREE.AudioLoader();

        THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
			this._stage.$emit(Events.ON_LOAD_PROGRESS, {url, loaded, total});
		};

    }

    
}