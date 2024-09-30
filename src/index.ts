import ThreeView from "./threeview/init";

// 实例化threeview
const app = document.getElementById("app") as HTMLDivElement;
const threeView = new ThreeView(app, {
    width: app.offsetWidth,
    height: app.offsetHeight,
    // devicePixelRatio:1
});

// 渲染数据
const data = '../module/battlecry.fbx' 
// const data = '../module/suzanne.gltf'
// const data = 'https://static.funxdata.com/view/skphouse.fbx'
threeView.setData(data);

// 加载视图工具
threeView.windowWiew({
    fps: true, // 开启fps帧率
    box3: true, // 开启包围盒

});
