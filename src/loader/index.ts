import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 
import {MeshBVH, MeshBVHOptions, StaticGeometryGenerator} from "three-mesh-bvh";

export class Loader { 
    private _scene: THREE.Scene
    private _mesh: THREE.Mesh
    private _renderer: THREE.WebGLRenderer

    constructor(obj: any) { 
        // 取出core中定义的场景
        this._scene = obj.scene
        // 取出core中定义的网格
        this._mesh = obj.mesh
        // 取出core中定义的渲染器
        this._renderer = obj.renderer


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
        return new Promise(res => { 
            // 加载模型
            const loader = new GLTFLoader();
            loader.load(data, (gltf) => { 
                this._scene.add(gltf.scene);
                const group = gltf.scene;
                group.updateMatrixWorld(true);
                // group.traverse(item => { 
                //     item.
                
                    
                // })
                
                const static_generator = new StaticGeometryGenerator(group);
                static_generator.attributes = ["position"];

                const merged_geometry = static_generator.generate();
                merged_geometry.boundsTree = new MeshBVH(merged_geometry, {lazyGeneration: false} as MeshBVHOptions);
            
                
                this._mesh = new THREE.Mesh(merged_geometry);
                this._scene.add(group);


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

        })
    }

}
