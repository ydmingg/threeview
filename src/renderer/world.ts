import { Environment } from "./environment";
// import Character from "../character";
// import Css3DRenderer from "../css3DRenderer";
// import Audio from "../audio";
// import RayCasterControls from "../rayCasterControls";
import * as THREE from "three";
// import { Emitter } from "../util";
import { Events } from "../types";
import { Stage } from "../stage";

export class World { 
    private _otps: any;
    private _stage: Stage;
    private _environment: Environment;


    constructor(otps: any) { 
        this._otps = otps;
        this._stage = new Stage(this._otps);


        this._stage.$on(Events.ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));
        this._stage.$on(Events.ON_LOAD_MODEL_FINISH, this._onLoadModelFinish.bind(this));
        
        this._environment = new Environment(this._otps);
        
       

    }

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
        // console.log(data);
        
		// 场景模型加载完毕后开始加载音频
		// await this._audio.createAudio(data);

		// 音频加载完毕后移除加载进度UI，显示进入确认UI
		this._stage.ui.removeLoading();

		// 场景模型加载完毕后将场景中需要光线投射检测的物体传入给rayCasterControls
		this.ray_caster_controls.bindClickRayCastObj(this.environment.raycast_objects);
	}

    setData(data: any) { 
        this._environment.loadScenes(data)

    }


}