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
} from "@pattern-x/gemini-viewer-threejs";

const filename = "suzanne.gltf";
const modelCfg = {
    modelId: filename,
    name: filename,
    src: `../static/models/${filename}`,
    edges: true,
};

const viewerCfg = {
    containerId: "app",
    // language: "cn",
    enableProgressBar: true,
}
const viewer = new BimViewer(viewerCfg);

const menuConfig = {
    [ToolbarMenuId.Measure]: { visible: true },
    [ToolbarMenuId.Fullscreen]: { visible: false },
};
new AxisGizmoPlugin(viewer, { ignoreZAxis: true });
new BimViewerToolbarPlugin(viewer, { menuConfig });
new ContextMenuPlugin(viewer);
new MeasurementPlugin(viewer);
new ViewCubePlugin(viewer);
new SectionPlugin(viewer);
new SkyboxPlugin(viewer);

// draco decoder path is needed to load draco encoded models.
// gemini-viewer js sdk user maintains draco decoder code somewhere, and provides the path here.
// const decoderPath = "../static/gltf/";
// viewer.setDracoDecoderPath(decoderPath);

viewer.loadModel(modelCfg, (event) => {
    const progress = ((event.loaded * 100) / event.total).toFixed(1);
    // console.log(`[Demo] Loading '${modelCfg.id || modelCfg.name}' progress: ${progress}%`);
    // }, (event) => {
    //     console.error("[Demo] Failed to load " + modelCfg.src + ". " + event.message);
    // }).then(() => {
    //     console.log(`[Demo] Loaded model ${modelCfg.src}`);
});