import * as THREE from "three";
import { MeshBVH, MeshBVHOptions, StaticGeometryGenerator } from "three-mesh-bvh";
import { Stage } from "../stage";
import { Loader } from "./loader";
import { Events, CharacterParams } from "../types";
import { isMesh, isLight } from "../util";

export class Environment {
    private _opts: any;
    private _stage: Stage;
    private _loader: Loader;
    collision_scene: THREE.Group | undefined;
    audio_mesh: THREE.Mesh | undefined;
	positional_audio: THREE.PositionalAudio | undefined;
	collider: THREE.Mesh | undefined;
    texture_boards: Record<string, THREE.Texture> = {};
    gallery_boards: Record<string, THREE.Mesh> = {};
    raycast_objects: THREE.Object3D[] = [];
    characterParams: CharacterParams = {}
	is_load_finished = false;

    constructor(opts: any) {
        this._opts = opts
        this._stage = new Stage(this._opts);
        this._loader = this._stage.loader
        
    }

	// 加载全部场景物体（地图、画框和贴图、地板反射）
	async loadScenes(data: any) {
		try {
            await this._loadSceneAndCollisionDetection(data);
			this.is_load_finished = true;
			this._stage.$emit(Events.ON_LOAD_MODEL_FINISH);
            
		} catch (e) {
			console.log(e);
		}
    }

    
	// 加载含碰撞检测的场景
    private _loadSceneAndCollisionDetection(data: any): Promise<void> {
        return new Promise(resolve => {
            
            this._loader.gltf_loader.load(data.module.scene, (gltf) => {
                
                this.collision_scene = gltf.scene;
                
				this.collision_scene.updateMatrixWorld(true);

				this.collision_scene.traverse(item => {
					if (item.name === "home001" || item.name === "PointLight") {
						item.castShadow = true;
					}

					if (item.name.includes("PointLight") && isLight(item)) {
						item.intensity *= 2000;
					}

					if (item.name === "home002") {
						item.castShadow = true;
						item.receiveShadow = true;
                    }

					this.raycast_objects.push(item);
				});

				const static_generator = new StaticGeometryGenerator(this.collision_scene);
				static_generator.attributes = ["position"];

				const merged_geometry = static_generator.generate();
				merged_geometry.boundsTree = new MeshBVH(merged_geometry, {lazyGeneration: false} as MeshBVHOptions);
                
                this.collider = new THREE.Mesh(merged_geometry);
				this._stage.scene.add(this.collision_scene);

				resolve();
            }, (event) => {
                this._stage.$emit(Events.ON_LOAD_PROGRESS, { url: data.module.scene, loaded: event.loaded, total: event.total });
                
			});
		});
    }
    
}
