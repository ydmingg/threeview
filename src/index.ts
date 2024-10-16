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
const datas = threeView.setData(data);

// 加载视图工具
threeView.windowWiew({
    fps: true, // 开启fps帧率
    // box3: true, // 开启包围盒

});

// 设置模型旋转轴
threeView.setModesRotate({ x: 0, y: -90, z: 0 });

// 播放动画
// threeView.setModesAnimate(0);

const button = document.createElement("button");
button.innerHTML = "开始动画";
const oPopup = document.querySelector("#popup") as HTMLDivElement;
oPopup.style.position = "absolute";
oPopup.style.top = "40px";
oPopup.style.right = "40px";
button.style.padding = "10px 20px";
button.style.background = "#f0da62";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.style.userSelect = "none";
oPopup.appendChild(button);

button.addEventListener("click", () => { 
    threeView.setModesAnimate();
    
})
