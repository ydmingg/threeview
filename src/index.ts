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
    [ToolbarMenuId.Measure]: { visible: true },
    [ToolbarMenuId.Fullscreen]: { visible: false }, 
};

new AxisGizmoPlugin(viewer);
new BimViewerToolbarPlugin(viewer, { menuConfig });
new ContextMenuPlugin(viewer);
new MeasurementPlugin(viewer);
new ViewCubePlugin(viewer);
new SectionPlugin(viewer);
new SkyboxPlugin(viewer);

// draco decoder path is needed to load draco encoded models.
// gemini-viewer js sdk user maintains draco decoder code somewhere, and provides the path here.
const decoderPath = "../static/gltf/";
viewer.setDracoDecoderPath(decoderPath);

viewer.loadModel(modelCfg, (event) => {
    const progress = ((event.loaded * 100) / event.total).toFixed(1);
});