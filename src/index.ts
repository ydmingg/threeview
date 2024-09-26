import ThreeView from "./threeview/init";

const app = document.getElementById("app") as HTMLDivElement;

// 实例化threeview
const threeView = new ThreeView(app, {
    width: app.offsetWidth,
    height: app.offsetHeight,
    // devicePixelRatio:1
});

// 渲染数据
const data = '../module/suzanne.glb'
threeView.setData(data);

// 加载视图工具
threeView.windowWiew({
    fps: true, // 开启fps帧率
    
});
