
//  定义视图缩放信息接口
export interface ViewScaleInfo { 
    offsetTop: number;
    offsetBottom: number;
    offsetLeft: number;
    offsetRight: number;
}

//  定义视图信息接口
export interface ViewContextSize {
    contextWidth: number;
    contextHeight: number;
}

//  定义视图信息接口
export interface ViewSizeInfo extends ViewContextSize {
    width: number;
    height: number;
    devicePixelRatio: number;
}

