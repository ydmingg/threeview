import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

export class Loader { 
    private _scene: THREE.Scene
    private _mesh: THREE.Mesh
    private _material: THREE.MeshStandardMaterial
    private _renderer: THREE.WebGLRenderer
    loaderMap: {}

    constructor(obj: any) { 
        // 取出core中定义的场景
        this._scene = obj.scene
        // 取出core中定义的网格
        this._mesh = obj.mesh
        // 取出core中定义的材质
        this._material = obj.material
        // 取出core中定义的渲染器
        this._renderer = obj.renderer

        // 
        this.loaderMap = {
            'glb': new GLTFLoader(),
            'gltf': new GLTFLoader(),
            'fbx': new FBXLoader(),
			'obj': new OBJLoader(),
            'stl': new STLLoader(),
        }


        // 设置 dracoLoader 应该去哪个目录里查找 解压(解码) 文件
        // this.loader_drc.setDecoderPath('../../public/draco/')
        // // 使用兼容性强的draco_decoder.js解码器
        // this.loader_drc.setDecoderConfig({ type: "js" }); 
        // // 将 dracoLoader 传递给 gltfLoader，供 gltfLoader 使用
        // this.loader_gltf.setDRACOLoader(this.loader_drc)

        // 创建光源
        this.light()
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
            
            // 加载模型
            loaders.load(data, (gltf: any) => {
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
                

                // const isbool = true
                // if (isbool) { 
                //     group.traverse(child => { 
                //         // console.log(child instanceof THREE.Mesh);
                //         // if (child instanceof THREE.Mesh && child !== plane) { 

                //         // }
                        
                //     })
                // }
                
                
                const box = new THREE.Box3().setFromObject(model)
                const center = box.getCenter(new THREE.Vector3())
            
                model.position.x += (model.position.x - center.x)
                model.position.y += (model.position.y - center.y)
                model.position.z += (model.position.z - center.z)

                // 更新包围盒
                model.updateMatrixWorld(true);
                // 将包围盒添加到场景
                this._scene.add(model);
                
                resolve(data);
            }, (val) => {
                const loadProgress = (val.loaded / val.total) * 100
                console.log(loadProgress);
                
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

}
