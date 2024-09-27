import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { ON_LOAD_MODEL_FINISH } from "./event";

export class Loader { 
    private _scene: THREE.Scene
    private _camera: THREE.PerspectiveCamera
    private _mesh: THREE.Mesh
    private _material: THREE.MeshStandardMaterial
    private _renderer: THREE.WebGLRenderer
    private _controls: OrbitControls
    
    loaderMap: {}

    constructor(obj: any) { 
        // 取出core中定义的场景
        this._scene = obj.scene
        // 取出core中定义的相机
        this._camera = obj.camera
        // 取出core中定义的网格
        this._mesh = obj.mesh
        // 取出core中定义的材质
        this._material = obj.material
        // 取出core中定义的渲染器
        this._renderer = obj.renderer
        // 取出core中定义的控制器
        this._controls = obj.controls

        // 
        this.loaderMap = {
            'glb': new GLTFLoader(),
            'gltf': new GLTFLoader(),
            'fbx': new FBXLoader(),
			'obj': new OBJLoader(),
            'stl': new STLLoader(),
        }


        // 创建光源
        // this.light()
    }

    // 异步加载全部场景和模型
    async loadScenes(data: any) { 
        try {
            // 开始加载模型
            await this._loadScenesModel(data);
            

        } catch (err) { 
            console.log("场景模型加载错误：" + err);
            
        }   
    }


    // 处理模型加载
    private async _loadScenesModel(data: any) { 
        return new Promise(resolve => {
            // 检测文件类型
            const type = data.substring(data.lastIndexOf(".") + 1) 
            // 根据文件类型匹配加载器
            const loaders = this.loaderMap[type]

            // 设置 dracoLoader 应该去哪个目录里查找 解压(解码) 文件
            // const load1er = loaders.setPath(data);
            // console.log(load1er);
            
            // this.loader_drc.setDecoderPath('../../public/draco/')
            // // 使用兼容性强的draco_decoder.js解码器
            // this.loader_drc.setDecoderConfig({ type: "js" }); 
            // // 将 dracoLoader 传递给 gltfLoader，供 gltfLoader 使用
            // this.loader_gltf.setDRACOLoader(this.loader_drc)
            
            // 加载模型
            loaders.load(data, (gltf) => {
                let model: any;
                switch (type) { 
                    case 'glb':
                        model = gltf.scene
                        break;
                    case 'gltf':
                        model = gltf.scene
                        break;
                    case 'fbx':
                        model = gltf
                        break;
                    case 'obj':
                        model = gltf
                        break;
                    case 'stl':
                        model = new THREE.Mesh(gltf, this._material);
                        break;
                    default:
                        break;
                }

                // const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 白光，强度为1
                // this._scene.add(ambientLight);
                // const dirLight = new THREE.DirectionalLight('rgb(253,253,253)', 5);
                // dirLight.position.set(10, 10, 5); // 根据需要自行调整位置
                // this._scene.add(dirLight);

                // 递归遍历所有模型节点
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        // 模型开启阴影
                        child.castShadow = true
                        child.receiveShadow = true;
                        
                        // 模型自发光
                        child.material.emissive = child.material.color;
                        child.material.emissiveMap = child.material.map;

                    }
                })

               

                // 计算场景中对象的包围盒大小，并根据大小和中心点调整相机和控制器的位置。
                this.fitOnScreen(model)

                model.updateMatrixWorld(true);
                // 将包围盒添加到场景
                this._scene.add(model);
                
                resolve(gltf.scene);
            }, (val) => {
                const loadProgress = Math.floor((val.loaded / val.total) * 100)
                // if (loadProgress === 100) { 
                    
                    
                // }
                console.log("模型已加载: ", loadProgress + "%");
                
            });
        });
    }

    light() { 
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
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        


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
        this._scene.add(pointLight, pointLightHelper)


        // //色调映射
		// this._renderer.toneMapping = THREE.ACESFilmicToneMapping
		// //曝光
		// this._renderer.toneMappingExposure = 30
		// this._renderer.shadowMap.enabled = true
		// this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    fitOnScreen(model: any) { 
        // 创建包围盒
        const box3 = new THREE.Box3().setFromObject(model);
        // 包围盒大小
        const boxSize = box3.getSize(new THREE.Vector3()).length();
        // 包围盒中心点
        const boxCenter = box3.getCenter(new THREE.Vector3());
        
        // 添加包围盒的辅助对象
        const helper = new THREE.Box3Helper(box3, 0xffff00);
        this._scene.add(helper);

        // 根据给定的尺寸，计算相机的位置和截锥体的近平面和远平面。
        this.frameArea({
            sizeToFitOnScreen: boxSize*1.5,
            boxSize: boxSize,
            boxCenter: boxCenter,
        })

        this._controls.maxDistance = boxSize * 10;
        // 控制器将以 boxCenter 为中心进行旋转和缩放操作。
        this._controls.target.copy(boxCenter);
        // 摄像机的变换发生任何手动改变后调用
        this._controls.update();
    }

    frameArea({
        sizeToFitOnScreen,
        boxSize,
        boxCenter
    }) { 
        // 根据计算出的尺寸将其一半的尺寸作为相机距离物体的距离
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        //   计算相机视野中心点与物体中心点的距离
        const halfFovY = THREE.MathUtils.degToRad(this._camera.fov * 0.5);
        // 计算相机距离物体的距离
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

        // 创建一个三维向量
        const direction = new THREE.Vector3()
        // 计算两个向量的差值，即从包围盒中心指向相机位置的向量
        const subVectors = direction.subVectors(this._camera.position, boxCenter)
        // 把y轴置零，x z轴不变
        const multiply = subVectors.multiply(new THREE.Vector3(1, 0, 1))
        // 设置方向的单位向量
        const normalize = multiply.normalize()
        
        // 根据距离和中心点，设置相机的位置
        this._camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
        
        // 计算近平面值
        this._camera.near = boxSize / 100;
        // 计算远平面值
        this._camera.far = boxSize * 100;
        // 更新相机的投影矩阵
        this._camera.updateProjectionMatrix();
        // 将相机的视角对准包围盒的中心
        this._camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

    }

}
