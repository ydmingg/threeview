import * as THREE from "three";
import { Events, CoreOptions } from "../types";
import { Stage } from "../stage";
import { Attribute } from "../renderer";
import { Environment } from "./environment";

export class World { 
    private _opts: any;
    private _stage: Stage;
    private _environment: Environment;
    private _attribute: Attribute;


    constructor(opts: CoreOptions) { 
        this._opts = opts;
        this._stage = new Stage(this._opts);

        this._stage.$on(Events.ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));
        this._stage.$on(Events.ON_LOAD_MODEL_FINISH, this._onLoadModelFinish.bind(this));

        this._environment = new Environment(this._opts);
        this._attribute = new Attribute(this._stage, { speed: 12 });

    }

    update(delta: number) {
		if (this._environment.collider && this._environment.is_load_finished) {
            
            this._attribute.update(delta, this._environment.collider);
		}
    }
    
    private async _onLoadModelFinish(data: any) {
		// 音频加载完毕后移除加载进度UI，显示进入确认UI
		this._stage.ui.removeLoading();

	}

    private _handleLoadProgress([{url, loaded, total}]: [{url: string, loaded: number, total: number}]) {
        const percentage = ((loaded / total) * 100).toFixed(0);
        
        if (/.*\.(blob|glb|gltf)$/i.test(url)) {
            this._stage.ui.updateLoadingProgress(`${url.includes("collision") ? "加载模型" : "加载其他场景模型"}：${percentage}%`);
        }
    }
    
    setData(data: any) { 
        // 更新renderer
        this._stage.renderer.setAnimationLoop(() => {
			this._stage.renderer.render(this._stage.scene, this._stage.camera);
			const delta_time = Math.min(0.05, this._stage.clock.getDelta());
			this.update(delta_time);
			this._stage.orbit_controls.update();
        });
        
        this._environment.loadScenes(data)

    }

}