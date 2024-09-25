import * as THREE from 'three'
import type { CoreOptions, windowViewPlugin } from '../types'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 
import Stats from 'three/examples/jsm/libs/stats.module';
import { Loader } from '../loader'

import {MeshBVH, MeshBVHOptions, StaticGeometryGenerator} from "three-mesh-bvh";

export class Core{ 
    private _container: HTMLDivElement;
    private _opts: CoreOptions;
    private _loader: Loader;
    
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    mesh!: THREE.Mesh;
    renderer!: THREE.WebGLRenderer;
    orbit_controls!: OrbitControls;
    clock!: THREE.Clock;
    stats!: Stats;

    constructor(container: HTMLDivElement, opts: CoreOptions) {
        const { width, height, devicePixelRatio = 1 } = opts;
        this._container = container;
        this._opts = opts;

        // 实例化
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.mesh = new THREE.Mesh();
        this.renderer = new THREE.WebGLRenderer();
        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.stats = new Stats();
        this._loader = new Loader({
            scene: this.scene,
            mesh: this.mesh,
            renderer: this.renderer,
        }); 

        this._initScene();
        this._initCamera();
        this._initRender();
        
        // 动态更新视图
        window.addEventListener('resize', this._resizeWindow.bind(this)) 

    }

    initupdate() { 
        const FPS = 30;
        const renderT = 1 / FPS; //单位秒  间隔多长时间渲染渲染一次
        let timeS = 0;

        // 动画循环
        this.renderer.setAnimationLoop(() => {
            
            // 获取两帧的时间间隔
            const T = this.clock.getDelta();
            timeS = timeS + T;
            // 通过时间判断，降低renderer.render执行频率
            if (timeS > renderT) { 
                // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
                // console.log(`调用.render时间间隔`, timeS * 1000 + '毫秒');
                this.stats.update();
                // 更新相机位置
                this.renderer.render(this.scene, this.camera);
                // 更新轨道控制器
                this.orbit_controls.update();
                timeS = 0;
            }
            
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
        //
        // this.renderer.setPixelRatio(this._opts.devicePixelRatio = 1);
    }

    // 添加物体
    setData(data: any) { 
        this.initupdate();
        // 加载方法
        this._loader.loadScenes(data)

    }

    // 窗口视图插件
    windowWiew(data: windowViewPlugin) {
        for (const key in data) {
            // FPS帧率
            if (key === "fps") { 
                this._container.appendChild(this.stats.dom);
            }
            //
            

        }

        
    }

}
