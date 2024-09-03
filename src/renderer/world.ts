import { Environment } from "./environment";
// import Character from "../character";
// import Css3DRenderer from "../css3DRenderer";
// import Audio from "../audio";
import * as THREE from "three";
// import { Emitter } from "../util";
import { Events, CoreOptions } from "../types";
import { Stage } from "../stage";
import { Attribute, RayCasterControls } from "../renderer";


export class World { 
    private _opts: any;
    private _stage: Stage;
    private _environment: Environment;
    private _attribute: Attribute;
    private _ray_caster_controls: RayCasterControls;


    constructor(opts: CoreOptions) { 
        this._opts = opts;
        this._stage = new Stage(this._opts);

        this._stage.$on(Events.ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));
        this._stage.$on(Events.ON_LOAD_MODEL_FINISH, this._onLoadModelFinish.bind(this));
        // this._stage.$on(Events.ON_ENTER_APP, this._onEnterApp.bind(this));

        this._environment = new Environment(this._opts);
        this._attribute = new Attribute(this._stage, { speed: 12 });
        this._ray_caster_controls = new RayCasterControls(this._opts);
        
       

    }

    update(delta: number) {
		if (this._environment.collider && this._environment.is_load_finished) {
			// this.css_3d_renderer.update();
            this._attribute.update(delta, this._environment.collider, this._environment.characterParams);
			this._ray_caster_controls.updateTooltipRayCast(this._environment.raycast_objects);
		}
    }
    
     // 点击进入展馆后响应动态文件
    // private _onEnterApp() {
    //     // 场景模型加载完毕后开始加载音频
	// 	this._environment.positional_audio?.play();
	// }

    private _handleLoadProgress([{url, loaded, total}]: [{url: string, loaded: number, total: number}]) {
        const percentage = ((loaded / total) * 100).toFixed(0);
        
		if (/.*\.(blob|glb)$/i.test(url)) {
			this._stage.ui.updateLoadingProgress(`${url.includes("collision") ? "加载碰撞场景模型" : "加载其他场景模型"}：${percentage}%`);
		}
		if (/.*\.(jpg|png|jpeg)$/i.test(url)) {
			this._stage.ui.updateLoadingProgress("加载图片素材中...");
		}
		if (/.*\.(m4a|mp3)$/i.test(url)) {
			this._stage.ui.updateLoadingProgress("加载声音资源中...");
		}
    }

    private async _onLoadModelFinish(data: any) {
		// 音频加载完毕后移除加载进度UI，显示进入确认UI
		this._stage.ui.removeLoading();

		// 场景模型加载完毕后将场景中需要光线投射检测的物体传入给rayCasterControls
		this._ray_caster_controls.bindClickRayCastObj(this._environment.raycast_objects);
	}

    setData(data: any) { 
        this._environment.loadScenes(data)

        // 更新renderer
        this._stage.renderer.setAnimationLoop(() => {
			this._stage.renderer.render(this._stage.scene, this._stage.camera);
			const delta_time = Math.min(0.05, this._stage.clock.getDelta());
			this.update(delta_time);
			this._stage.orbit_controls.update();
		});
    }


}