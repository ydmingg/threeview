import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Watcher } from "../stage/watcher";

export class Stage { 
    private _opts: any;
    private _watcher: any;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    clock: THREE.Clock;
    orbit_controls: OrbitControls;
    

    constructor(opts: any) { 
        const watcher = new Watcher();
        
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.camera = new THREE.PerspectiveCamera();
        this.clock = new THREE.Clock();
        this.orbit_controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        
        this._opts = opts
        this._watcher = watcher;
        this.initLoading();
        this.initCamera(this._opts);
        this.initRenderer(this._opts);
        this.initResponsiveResize(this._opts);


        
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
    setData(url: string) {
		this.renderer.setAnimationLoop(() => {
			this.renderer.render(this.scene, this.camera);
			const delta_time = Math.min(0.05, this.clock.getDelta());
			this._watcher.update(delta_time);
			this.orbit_controls.update();
        });
        
	}

    



}