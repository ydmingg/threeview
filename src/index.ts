import {
    AxisGizmoPlugin,
    BimViewer,
    BimViewerToolbarPlugin,
    ContextMenuPlugin,
    MeasurementPlugin,
    SectionPlugin,
    SkyboxPlugin,
    ToolbarMenuId,
    ViewCubePlugin,
} from "./libs/gemini-viewer.esm.min.js";

const filename = "01-module.glb";
const modelCfg = {
    modelId: filename,
    name: filename,
    src: `../models/${filename}`,
    edges: true
};

const viewerCfg = {
    containerId: "app",
    language: "cn",
    enableProgressBar: true,
}

//实例化BimViewer
const viewer = new BimViewer(viewerCfg);

// 配置导航栏参数
const menuConfig = { 
    // [ToolbarMenuId.HomeView]: { visible: true }, // 主视图
    // [ToolbarMenuId.OrthoMode]: { visible: false }, // 正交视图
    [ToolbarMenuId.Fullscreen]: { visible: false }, // 全屏
    // [ToolbarMenuId.Measure]: { visible: false }, // 测量
    // [ToolbarMenuId.Section]: { visible: false }, // 刨切
};

// 加载坐标轴
new AxisGizmoPlugin(viewer);
// 加载导航栏
new BimViewerToolbarPlugin(viewer, { menuConfig }); 
// 加载右键菜单
new ContextMenuPlugin(viewer);
// 加载三维模型视图
new ViewCubePlugin(viewer);

new MeasurementPlugin(viewer);
new SectionPlugin(viewer);
new SkyboxPlugin(viewer);

viewer.loadModel(modelCfg, (event: { loaded: number; total: number; }) => {
    const progress = ((event.loaded * 100) / event.total).toFixed(1);
});
