import * as THREE from "three";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";

// import Core from "../core";
import { Stage } from "../stage";
import { Loader } from "./loader";
import { Events } from "../types";


// import {isLight, isMesh} from "../utils/typeAssert";
// import {MeshBVH, MeshBVHOptions, StaticGeometryGenerator} from "three-mesh-bvh";
// import {Reflector} from "../lib/Reflector";

export class Environment {
    private _opts: any;
    private _stage: Stage;
    private loader: Loader;
    private collision_scene: THREE.Group | undefined;
    private audio_mesh: THREE.Mesh | undefined;
	private positional_audio: THREE.PositionalAudio | undefined;
	collider: THREE.Mesh | undefined;
	private texture_boards: Record<string, THREE.Texture> = {};
	private gallery_boards: Record<string, THREE.Mesh> = {};
	raycast_objects: THREE.Object3D[] = [];
	is_load_finished = false;

    constructor(otps: any) {
        this._opts = otps
        this._stage = new Stage(this._opts);
        this.loader = this._stage.loader
        // this.loadScenes({
        //     scene: '../../static/models/scene_collision.glb',
        //     word: '../../static/models/scene_desk_obj.glb'
        // });
        // console.log(this._stage.loader);
        
        
        
	}

	/*
	* 加载全部场景物体（地图、画框和贴图、地板反射）
	* */
	async loadScenes(data: any) {
		try {
            await this._loadSceneAndCollisionDetection(data);
			await this._loadStaticScene(data);
            await this._loadBoardsTexture(data);
            await this._loadAudio(data);
			// this._configureGallery();
			// this._createSpecularReflection();
			this.is_load_finished = true;
			this._stage.$emit(Events.ON_LOAD_MODEL_FINISH);
		} catch (e) {
			console.log(e);
		}
	}
    
    private async _loadAudio(data: any): Promise<void> { 
        this.audio_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
		this.audio_mesh.position.set(-15.9, 4.49, 36.42);
		this.audio_mesh.visible = false;
		this._stage.scene.add(this.audio_mesh);

		const listener = new THREE.AudioListener();

		this._stage.camera.add(listener);
		this.positional_audio = new THREE.PositionalAudio(listener);
		this.audio_mesh.add(this.positional_audio);
        
        
		const buffer = await this._stage.loader.audio_loader.loadAsync(data.audio.background);
		this.positional_audio.setBuffer(buffer);
		this.positional_audio.setVolume(0.8);
		this.positional_audio.setRefDistance(2);
		this.positional_audio.setDirectionalCone(180, 230, 0.5);
		this.positional_audio.setLoop(true);

		const helper = new PositionalAudioHelper(this.positional_audio);
		this.positional_audio.add(helper);

		return Promise.resolve();
    }
    

	private async _loadBoardsTexture(data: any): Promise<void> {
		for (let i = 0; i < data.textures.length; i++) {
			this.texture_boards[i + 1] = await this.loader.texture_loader.loadAsync(data.textures[i]);
		}

		for (const key in this.texture_boards) {
			const texture = this.texture_boards[key]
			texture.colorSpace = THREE.SRGBColorSpace;

			// 根据纹理的宽高比和平面的宽高比，计算需要的缩放比例
			const texture_aspect_ratio = texture.image.width / texture.image.height;
			let scale_x = 1;
			let scale_y = 1;

			if (texture_aspect_ratio > 1) {
				scale_x = 1 / texture_aspect_ratio;
			} else {
				scale_y = texture_aspect_ratio;
			}

			// 设置纹理的偏移和重复以进行居中和适应
			texture.offset.set(0.5 - scale_x / 2, 0.5 - scale_y / 2);
			texture.repeat.set(scale_x, scale_y);
			texture.needsUpdate = true;
		}

		return Promise.resolve();
    }

	// /*
	// * 设置画板userData数据、贴图翻转
	// * */
	// private _configureGallery() {
	// 	for (const key in this.texture_boards) {
	// 		const board = this.gallery_boards[`gallery${key}_board`];
	// 		const board_material = board.material;
	// 		(board_material as MeshBasicMaterial).map = this.texture_boards[key];
	// 		board.userData = {
	// 			name: board.name,
	// 			title: BOARDS_INFO[key].title,
	// 			author: BOARDS_INFO[key].author,
	// 			describe: BOARDS_INFO[key].describe,
	// 			index: key,
	// 			src: this.texture_boards[key].image.src,
	// 			show_boards: true
	// 		};

	// 		// 翻转贴图
	// 		if ([4, 5, 6, 7, 9].includes(+key)) {
	// 			board.rotation.y = -Math.PI / 2;
	// 		}
	// 		if (8 === +key) {
	// 			board.rotation.y = Math.PI;
	// 		}

	// 		(board_material as MeshBasicMaterial).needsUpdate = true;
	// 	}
	// }

	// /*
	// * 产生地面镜面反射
	// * */
	// private _createSpecularReflection() {
	// 	const mirror = new Reflector(new PlaneGeometry(100, 100), {
	// 		textureWidth: window.innerWidth * window.devicePixelRatio,
	// 		textureHeight: window.innerHeight * window.devicePixelRatio,
	// 		color: 0xffffff,
	// 	});
	// 	if (mirror.material instanceof Material) {
	// 		mirror.material.transparent = true;
	// 	}
	// 	mirror.rotation.x = -0.5 * Math.PI;
	// 	this.core.scene.add(mirror);
	// }

	// 加载不含碰撞其他的场景
	private _loadStaticScene(data: any): Promise<void> {
		return new Promise(resolve => {
			this.loader.gltf_loader.load(data.module.word, (gltf) => {
				this._stage.scene.add(gltf.scene);
				gltf.scene.traverse(item => {
					if (item.name === "computer") {
						item.userData = {
							name: item.name,
							title: "噢，是远方 🏕",
						};
						this.raycast_objects.push(item);
					}
				});
				resolve();
			}, (event) => {
				this._stage.$emit(Events.ON_LOAD_PROGRESS, {url: data.module.word, loaded: event.loaded, total: event.total});
			});
		});
	}

	// 加载含碰撞检测的场景
    private _loadSceneAndCollisionDetection(data: any): Promise<void> {
        return new Promise(resolve => {
			this.loader.gltf_loader.load(data.module.scene, (gltf) => {
				this.collision_scene = gltf.scene;

				this.collision_scene.updateMatrixWorld(true);

				this.collision_scene.traverse(item => {
					if (item.name === "home001" || item.name === "PointLight") {
						item.castShadow = true;
					}

					// if (item.name.includes("PointLight") && isLight(item)) {
					// 	item.intensity *= 2000;
					// }

					if (item.name === "home002") {
						item.castShadow = true;
						item.receiveShadow = true;
					}

					// 提取出相框元素
					// if (/gallery.*_board/.test(item.name) && isMesh(item)) {
					// 	this.gallery_boards[item.name] = item;
					// }

					this.raycast_objects.push(item);
				});

				// const static_generator = new StaticGeometryGenerator(this.collision_scene);
				// static_generator.attributes = ["position"];

				// const merged_geometry = static_generator.generate();
				// merged_geometry.boundsTree = new MeshBVH(merged_geometry, {lazyGeneration: false} as MeshBVHOptions);

				// this.collider = new THREE.Mesh(merged_geometry);
				// this.core.scene.add(this.collision_scene);

				resolve();
			}, (event) => {
                this._stage.$emit(Events.ON_LOAD_PROGRESS, { url: data.module.scene, loaded: event.loaded, total: event.total });
                
			});
		});
	}
}
