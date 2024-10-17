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

    // 加载数据
    setData(options: any) { 
        this._core.setData(options)
    }

    // 设置视图工具
    windowWiew(data: any) { 
        this._core.windowWiew(data)
    }

    // 设置模型旋转轴
    setModesRotate(obj: any) { 
        const { rotate } = obj
        this._core.setModesRotate(obj)

    }
    
    // 设置模型播放动画
    setModesAnimate(child: number, config?: {iterationCount:any, speed:any}) { 
        this._core.setModesAnimate(child, config);
    }


    

}
