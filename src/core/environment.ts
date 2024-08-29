import * as THREE from 'three';
import { Events } from '../types';
import { Emitter } from '../util';
import { Emitter } from '..';

export class Environment { 
    collider: THREE.Mesh | undefined;
    is_load_finish: boolean = false;
    Emitter: Emitter;
    loader: Lo

    constructor() { 
        this.Emitter = new Emitter();
        this.loader = new Loader();
        this.loadScenes()
        
    }

    async loadScenes() {
        try {
			await this._loadSceneAndCollisionDetection();
			// await this._loadStaticScene();
			// await this._loadBoardsTexture();
			// this._configureGallery();
			// this._createSpecularReflection();
			// this.is_load_finished = true;
			// this.core.$emit(Events.ON_LOAD_MODEL_FINISH);
			
			// console.log(this.collider);
		} catch (e) {
			console.log(e);
		}

    }

    // 加载含碰撞检测的场景
	private _loadSceneAndCollisionDetection(): Promise<void> {
		return new Promise(resolve => {
			this.loader.gltf_loader.load(COLLISION_SCENE_URL, (gltf) => {
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

					// 提取出相框元素
					if (/gallery.*_board/.test(item.name) && isMesh(item)) {
						this.gallery_boards[item.name] = item;
					}

					this.raycast_objects.push(item);
				});

				const static_generator = new StaticGeometryGenerator(this.collision_scene);
				static_generator.attributes = ["position"];

				const merged_geometry = static_generator.generate();
				merged_geometry.boundsTree = new MeshBVH(merged_geometry, {lazyGeneration: false} as MeshBVHOptions);

				this.collider = new Mesh(merged_geometry);
				this.core.scene.add(this.collision_scene);

				resolve();
			}, (event) => {
				this.core.$emit(ON_LOAD_PROGRESS, {url: COLLISION_SCENE_URL, loaded: event.loaded, total: event.total});
			});
		});
	}

}