import * as THREE from 'three'
import type { CoreOptions, windowViewPlugin } from '../types'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module';
import { Loader } from '../loader'

export class Core{ 
    private _container: HTMLDivElement;
    private _opts: CoreOptions;
    private _loader: Loader;
    
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    mesh!: THREE.Mesh;
    material!: THREE.MeshStandardMaterial;
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
        this.material = new THREE.MeshStandardMaterial();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); //设置抗锯齿
        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.stats = new Stats();
        this._loader = new Loader({
            scene: this.scene,
            camera: this.camera,
            mesh: this.mesh,
            material: this.material,
            renderer: this.renderer,
            controls: this.orbit_controls
        }); 

        this._initScene();
        this._initCamera();
        this._initRender();
        
        // 动态更新视图
        window.addEventListener('resize', this._resizeWindow.bind(this)) 
        

    }

    // 初始化场景
    private _initScene() { 
        // 设置场景背景颜色
        this.scene.background = new THREE.Color("#fff");
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
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    // 添加物体
    setData(data: any) { 
        // 创建循环动画
        this.renderer.setAnimationLoop(() => {
            // 循环调用函数中的update()方法，来刷新时间
            this.stats.update();
            // 循环刷新执行渲染操作
            this.renderer.render(this.scene, this.camera);
            // 更新轨道控制器
            this.orbit_controls.update();
            
        });

        // 加载模型、场景和材质等
        this._loader.loadScenes(data)

    }

    // 窗口视图插件
    windowWiew(data: windowViewPlugin) {
        for (const key in data) {
            // FPS帧率
            if (key === "fps") { 
                // 设置监视器面板，传入面板id（0:fps, 1: ms, 2: mb, 3+: custom）
                this.stats.showPanel(1); 
                // 将监视器添加到页面中
                this._container.appendChild(this.stats.dom);
            }
            // 
            
        }

    }

}
