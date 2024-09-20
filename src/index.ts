import ThreeView from "./threeview/init";

const app = document.getElementById("app") as HTMLDivElement;

// 实例化threeview
const threeView = new ThreeView(app, {
    width: app.offsetWidth,
    height: app.offsetHeight,
    // devicePixelRatio:1
});

const data = '../module/suzanne.gltf'
// 渲染数据
threeView.setData(data);
