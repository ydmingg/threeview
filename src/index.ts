import * as Three from 'three';

// 创建场景
const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#app")?.appendChild(renderer.domElement)
const url = 'https://gd-hbimg.huaban.com/9030ccd543ebe5dc2aa287a9374743d33341ec9242c0f-whGlxy_fw1200'

// 创建球体
const geometry = new Three.SphereGeometry(1, 32, 32);

// 创建绿色基本材质
let texture = new Three.TextureLoader().load(url); 
const material = new Three.MeshBasicMaterial({ 
    map: texture
}); 
const cube = new Three.Mesh(geometry, material);

// 将球体添加到场景中
scene.add(cube); 
// 把相机往后移动以观察球体
camera.position.z = 2;
// 添加环境光
const light = new Three.AmbientLight(0xffffff, .5); 
scene.add(light);
// 或者点光源/定向光
const pointLight = new Three.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 10);
scene.add(pointLight);

function animate() {
    requestAnimationFrame(animate);
  
    // 添加需要每帧更新的内容，如物体旋转、相机移动等
    renderer.render(scene, camera); // 渲染场景
}

// 开始渲染循环
animate(); 