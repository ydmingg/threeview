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
// const data = '../module/001.glb'
const data = '../module/1a.fbx'
// const data = '../module/020.glb'
// const data = '../module/suzanne.gltf'
// const data = '../module/003.fbx'
// const data = 'https://static.funxdata.com/view/skphouse.fbx'
const datas = threeView.setData(data);

// 加载视图工具
threeView.windowWiew({
    fps: true, // 开启fps帧率
    // box3: true, // 开启包围盒
    axes: true, // 开启坐标轴

});

// 设置模型旋转轴
threeView.setModesRotate({ x: 0, y: -90, z: 0 });

// 播放动画
// threeView.setModesAnimate(0);



// 动画测试
const oPopup = document.querySelector("#popup") as HTMLDivElement;
oPopup.style.position = "absolute";
oPopup.style.display = "flex";
oPopup.style.flexDirection = "column";
oPopup.style.gap = "10px";
oPopup.style.top = "40px";
oPopup.style.right = "40px";

for (let i = 0; i < 2; i++) {
    const button = document.createElement("button");
    button.innerHTML = "动画"+(i+1)+"";
    button.style.padding = "10px 20px";
    button.style.background = "#f0da62";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.userSelect = "none";
    oPopup.appendChild(button);
    button.addEventListener("click", () => { 
        // threeView.setModesAnimate(i, { iterationCount: 1, speed: 1 });
        
        // 测试声音
        checkMicrophoneAvailability()
    })
}

// 调用麦克风
function checkMicrophoneAvailability() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        // 如果到达这里，说明麦克风可用
        console.log("麦克风可用")
        stream.getTracks().forEach(track => track.stop()); // 停止流
      })
      .catch(function(error) {
        if (error.name === 'NotAllowedError') {
          // 用户拒绝了权限请求
          console.log("用户拒绝了麦克风权限") ;
        } else if (error.name === 'NotReadableError') {
          // 麦克风设备不可用
          console.log("麦克风设备不可用") 
        } else {
          // 其他错误
          console.log("检查麦克风时发生错误") 
        }
      });
}