import type { CoreOptions } from '../types'
import { Core } from "../core";

export default class ThreeView { 
    private _core : Core;
    constructor(mount: HTMLDivElement, options: CoreOptions) { 
        const opts = { ...options };
        const { width, height, devicePixelRatio } = opts;
        const core = new Core( mount, { width, height, devicePixelRatio })

        this._core = core
    }

    // 设置数据
    setData(options: any) { 
        this._core.setData(options)
    }

    // 设置FPS
    windowWiew(data: any) { 
        this._core.windowWiew(data)
    }
    

}
