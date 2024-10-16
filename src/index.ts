import ThreeView from "./threeview/init";

// 实例化threeview
const app = document.getElementById("app") as HTMLDivElement;
const threeView = new ThreeView(app, {
    width: app.offsetWidth,
    height: app.offsetHeight,
    // devicePixelRatio:1
});

// 渲染数据
// const data = '../module/an-hello.fbx' 
// const data = '../module/NP102/Model/J01/J01.fbx' 
// const data = '../module/an-girl.fbx'
// const data = '../module/xxxxx.fbx'
const data = '../module/001.glb'
// const data = '../module/suzanne.gltf'
// const data = '../module/003.fbx'
// const data = 'https://static.funxdata.com/view/skphouse.fbx'
threeView.setData(data);

// 加载视图工具
threeView.windowWiew({
    fps: true, // 开启fps帧率
    // box3: true, // 开启包围盒

});

// 设置模型旋转轴
threeView.setModes({
    rotate: { x: 0, y: -45, z: 0 },
    
});

// 播放动画
threeView.play();

