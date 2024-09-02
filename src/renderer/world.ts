// import Environment from "../environment";
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

    constructor(otps: any) { 
        this._otps = otps;
        this._stage = new Stage(this._otps);
        
        this._stage.$on(Events.ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));

    }

    private _handleLoadProgress([{url, loaded, total}]: [{url: string, loaded: number, total: number}]) {
        const percentage = ((loaded / total) * 100).toFixed(2);
        console.log(percentage);
        
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


}