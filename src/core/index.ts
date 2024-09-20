import * as THREE from 'three'
import type { CoreOptions } from '../types'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 

export class Core{ 
    private _container: HTMLDivElement;
    private _opts: CoreOptions;
    
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    orbit_controls!: OrbitControls;


    constructor(container: HTMLDivElement, opts: CoreOptions) {
        const { width, height, devicePixelRatio = 1 } = opts;
        this._container = container;
        this._opts = opts;

        // 实例化
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.renderer = new THREE.WebGLRenderer();
        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);

        this._initScene();
        this._initCamera();
        this._initRender();
        
        // 动态更新视图
        window.addEventListener('resize', this._resizeWindow.bind(this)) 


        // 动画循环
        this.renderer.setAnimationLoop(() => {
            // 更新相机位置
            this.renderer.render(this.scene, this.camera);
            // 更新轨道控制器
            this.orbit_controls.update();
        });
        
        
    }

    // 初始化场景
    private _initScene() { 
        // 设置场景背景颜色
        this.scene.background = new THREE.Color("#666");
    }

    // 初始化相机
    private _initCamera() { 
        // 相机视场角
        this.camera.fov = 45;
        // 相机宽高比
        this.camera.aspect = this._opts.width / this._opts.height
        // 相机近裁剪面
        this.camera.near = 0.1
        // 相机远裁剪面
        this.camera.far = 1000;
        // 相机位置
        this.camera.position.set(0, 0, 5)
        // 更新相机的投影矩阵
        this.camera.updateProjectionMatrix();
    }

    // 初始化渲染
    private _initRender() { 
        // 开启阴影效果
        this.renderer.shadowMap.enabled = true
        // 设置渲染器颜色空间
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        // 设置渲染器像素比
        this.renderer.setSize(this._opts.width, this._opts.height);
        // 将元素添加到容器中
        this._container.appendChild(this.renderer.domElement);
    }

    // 初始化窗口视图
    private _resizeWindow() { 
        // 更新视图大小
        const { offsetWidth, offsetHeight } = this._container;
        // 更新相机宽高比
        this.camera.aspect = offsetWidth / offsetHeight;
        // 更新渲染器宽高
        this.renderer.setSize(offsetWidth, offsetHeight);
        // 更新相机投影矩阵
        this.camera.updateProjectionMatrix();
        // this.renderer.setPixelRatio(this._opts.devicePixelRatio = 1);
    }

    // 添加物体
    setData(data: any) { 
        
        // 加载物体
        const loader = new GLTFLoader();
        loader.load(data, (gltf) => { 
        
            console.log(gltf.scene);
            
            this.scene.add(gltf.scene);
        })
        
        // console.log(data);
        // 模拟数据
        // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        // const cubeMaterial = new THREE.MeshStandardMaterial({
        //     color: "#fff",
        //     roughness: 0.1,
        //     metalness: 0.9,
        // });
        // const cube = new THREE.Mesh(geometry, cubeMaterial);
        // this.scene.add(cube)

        // // 添加环境光
        // const ambientLight = new THREE.AmbientLight("#0000ff", 10)
        // 添加点光源
        const pointLight = new THREE.PointLight( 0xffffff, 200, 20 );
        pointLight.position.set(0, 8, 0);
        pointLight.castShadow=true
        pointLight.shadow.radius=20;
        pointLight.shadow.mapSize.set(2048, 2048);
        pointLight.decay = 2
        
        // 开启阴影
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        
        


        // 添加聚光灯
        // const spotLight = new THREE.SpotLight(0xff0000, 5, 0, Math.PI / 4, 0.5, 2);
        // spotLight.position.set( 0, 10, 10 );
        // 添加平行光
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        // 半球灯光
        // const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        // 平面光源

    

        // 光源辅助器
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
        // 场景添加灯光
        this.scene.add(pointLight, pointLightHelper)

    }

    

}