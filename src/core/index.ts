// 
import type { CoreOptions } from "../types";
import { Stage } from "../stage";

// let instance: Core | null = null;
export class Core{ 
	// private _stage: Stage;
	// private container: HTMLDivElement;
	private _container: HTMLDivElement;
    
    constructor(container: HTMLDivElement, opts: CoreOptions) { 
		const { width, height, devicePixelRatio = 1 } = opts;

		this._container = container
		const stageContent = {
			width,
			height,
			devicePixelRatio,
			container: this._container
		}

		// 实例化3d空间
		const stage = new Stage(stageContent)
		// this._stage = stage

		
	}

	setData(data: any) { 
		
	}
	


    
}