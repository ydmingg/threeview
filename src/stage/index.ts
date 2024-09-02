import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UI, Loader, World, Environment } from "../renderer";
import { Emitter } from "../util";

let instance: Stage | null = null;
export class Stage extends Emitter { 
    private _opts: any;

    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    camera!: THREE.PerspectiveCamera;
    clock!: THREE.Clock;
    orbit_controls!: OrbitControls;

    ui!: UI;
    loader!: Loader
    world!: World

    constructor(opts: any) { 
        super();

        if (instance) {
            return instance
        }

        instance = this

        this._opts = opts
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.camera = new THREE.PerspectiveCamera();
        this.clock = new THREE.Clock();
        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        
        this.initLoading();
        this.initCamera(this._opts);
        this.initRenderer(this._opts);
        this.initResponsiveResize(this._opts);

        this.ui = new UI(this._opts);
        this.loader = new Loader(this._opts);
        this.world = new World(this._opts);
        
        
    }

    // 初始化加载进度
    initLoading() {
        const html = `
        <div class="loading">
            <div class="loading-circle"></div>
            <div class="progress"></div>
        </div>`
        document.body.insertAdjacentHTML('afterbegin', html)
    }

    //初始化相机
    initCamera(data: any) {
		this.camera.fov = 55;
		this.camera.aspect = data.width / data.height;
		this.camera.near = 0.1;
		this.camera.far = 1000;
		this.camera.position.set(0, 0, 3);
		this.camera.updateProjectionMatrix();
    }

    // 初始化渲染
    initRenderer(data: any) {
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.setSize(data.width, data.height);
		// this.renderer.domElement.style.position = "absolute";
		// this.renderer.domElement.style.zIndex = "1";
		// this.renderer.domElement.style.top = "0px";
		
		data.container.appendChild(this.renderer.domElement);
    }
    
    // 初始化resize
    initResponsiveResize(data: any) {
		window.addEventListener("resize", () => {
			this.camera.aspect = data.container.clientWidth / data.container.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(data.container.clientWidth, data.container.clientHeight);
			this.renderer.setPixelRatio(data.devicePixelRatio);
		});
    }

    // 初始化场景
    setData(data: any) {
        this.world.setData(data);
        
        
	}

    



}