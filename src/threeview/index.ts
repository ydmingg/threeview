import { Core } from '../core'

export class ThreeView { 
    private _core: Core;

    constructor(mount: HTMLDivElement, options: any) { 
        const opts = {...options}
        
        const { width, height, devicePixelRatio } = opts;
        const core = new Core(mount, { width, height, devicePixelRatio });

        this._core = core;
        
    }

    setData(data: any) {
        const core = this._core
        core.setData(data);
        
		
	}
}


