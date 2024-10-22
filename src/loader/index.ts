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
    private _clock: THREE.Clock
    private _loader_drc: DRACOLoader
    private _sceneGroup: THREE.Group | THREE.Mesh | undefined;
    modleAnimate: THREE.AnimationMixer | undefined;
    
    loaderMap: {}
    isbox3Helper: boolean = false
    isAxesHelper: boolean = false
    modleRotateMap: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }
    modleAnimateIndex: Array<any> = [];
    modleClipAction: any;

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
        this._clock = obj.clock

        // 创建解压器
        this._loader_drc = new DRACOLoader();
        
        // 
        this.loaderMap = {
            'glb': new GLTFLoader(),
            'gltf': new GLTFLoader(),
            'fbx': new FBXLoader(),
			'obj': new OBJLoader(),
            'stl': new STLLoader(),
        }
        

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
            loaders.load(data, (gltf) => {
                switch (type) { 
                    case 'glb':
                    case 'gltf':
                        this._sceneGroup = gltf.scene
                        // 设置 dracoLoader 应该去哪个目录里查找 解压(解码) 文件
                        this._loader_drc.setDecoderPath('../../public/draco/')
                        // 使用兼容性强的draco_decoder.js解码器
                        this._loader_drc.setDecoderConfig({ type: "js" }); 
                        // 将 dracoLoader 传递给 gltfLoader，供 gltfLoader 使用
                        loaders.setDRACOLoader(this._loader_drc)
                        // 在模型上绑定自带的动画
                        this.modleAnimate = new THREE.AnimationMixer(gltf.scene)
                        break;
                    case 'fbx':
                        this._sceneGroup = gltf
                        // 在模型上绑定自带的动画
                        this.modleAnimate = new THREE.AnimationMixer(gltf)
                        break;
                    case 'obj':
                        this._sceneGroup = gltf
                        // 在模型上绑定自带的动画
                        this.modleAnimate = new THREE.AnimationMixer(gltf)
                        break;
                    // case 'stl':
                    //     this._sceneGroup = new THREE.Mesh(gltf, this._material);
                    //     // 在模型上绑定自带的动画
                    //     this.modleAnimate = new THREE.AnimationMixer(gltf)
                    //     break;
                    default:
                        break;
                }

                if (this._sceneGroup) {
                    // 递归遍历所有模型节点
                    this._sceneGroup.traverse((child) => {
                        // 判断是否是网格模型
                        if (child instanceof THREE.Mesh) {
                            // 开启光照阴影和接受阴影
                            child.castShadow = true
                            // child.receiveShadow = true;
                            // 模型双面渲染
                            child.material.side = THREE.DoubleSide
                            // 取消模型裁剪
                            child.frustumCulled = false;

                            // 处理材质可能是数组的情况
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => {
                                    this.updateMaterial(mat,child);
                                });
                            } else {
                                this.updateMaterial(child.material,child);
                            }
                            
                        }
                    })

                    this.moduleFun(this._sceneGroup)

                    // 添加动画
                    this.animation(type === "glb" || "gltf" ? gltf : this._sceneGroup)

                    // 将模型添加到场景中
                    this._scene.add(this._sceneGroup);
                } else { 
                    throw new Error("模型加载失败");
                }
            }, (val) => {
                const loadProgress = Math.floor((val.loaded / val.total) * 100)
                console.log("模型已加载: ", loadProgress + "%");
                
            });
        });
    }

    updateMaterial(material: any, child: any) { 
        if (material) {
            // 调整有纹理时的材质
            if (material.map) {
                child.receiveShadow = true; // 接受阴影
                material.metalness = 0.5; // 设置金属度
                material.roughness = 0.5; // 设置粗糙度
                // 设置模型自发光效果
                if (material.emissive || material.emissiveMap) { 
                    material.emissive.set(material.color);
                    material.emissiveMap = material.map;
                }
            } else {  // 调整没有纹理时的材质
                child.receiveShadow = false; // 接受阴影
                material = new THREE.MeshStandardMaterial({
                    color: material.color, // 设置模型自身颜色
                    metalness: 0.5, // 设置金属度
                    roughness: 0.4, // 设置粗糙度
                    // emissive: new THREE.Color(0x222222), // 设置自发光
                    // emissiveIntensity: 1, // 设置自发光强度
                });
            }
        } else {
            // 设置没有材质的网格
            child.receiveShadow = true; // 接受阴影
            material = new THREE.MeshStandardMaterial({
                color: 0x888888, // 设置颜色
                metalness: 0.5, // 设置金属度
                roughness: 0.7, // 设置粗糙度
            });
        }
    
        // 确保材质被正确应用到网格模型上
        if (material.needsUpdate) {
            material.needsUpdate = true;
        }
    }

    moduleFun(model: any) { 
        if (!model) return;
        // 设置模型变换矩阵
        model.updateMatrixWorld(true);
        // 创建包围盒
        const box3 = new THREE.Box3().setFromObject(model);
        // 包围盒大小
        const boxSize = box3.getSize(new THREE.Vector3()).length();
        // 包围盒中心点
        const boxCenter = box3.getCenter(new THREE.Vector3());
        // 创建包围盒辅助器
        const box3Helper = new THREE.Box3Helper(box3, 0xff0000)
        // 设置包围盒控制器
        if (this.changeBox3box) { 
            this._scene.add(box3Helper);
        }

        // 创建坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(120);
        if (this.changeAxesHelper) { 
            this._scene.add(axesHelper);
        }

        // 平移模型，使几何中心位于原点
        model.position.sub(boxCenter);
        
        // 旋转模型
        const rotateX = THREE.MathUtils.degToRad(this.changeSetModlseRotate.x)
        const rotateY = THREE.MathUtils.degToRad(this.changeSetModlseRotate.y)
        const rotateZ = THREE.MathUtils.degToRad(this.changeSetModlseRotate.z)
        box3Helper.rotation.set(rotateX, rotateY, rotateZ);
        model.rotation.set(rotateX, rotateY, rotateZ); 
        
        // 再将模型平移回原来的位置
        model.position.add(boxCenter);


        // 根据给定的尺寸，计算相机的位置和截锥体的近平面和远平面。
        this.frameArea({
            sizeToFitOnScreen: boxSize * 1.5,
            boxSize: boxSize,
            boxCenter: boxCenter
        });

        //  
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
        const direction = new THREE.Vector3(0, 0, 1)
        // 计算两个向量的差值，即从包围盒中心指向相机位置的向量
        const subVectors = direction.subVectors(this._camera.position, boxCenter)
        // 把y轴置零，x z轴不变
        const multiply = subVectors.multiply(new THREE.Vector3(1, 0, 1))
        // 设置方向的单位向量
        const normalize = multiply.normalize()
        
        // 根据距离和中心点，设置相机的位置
        this._camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
        // 将相机的视角对准包围盒的中心
        this._camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        // 计算近平面值
        this._camera.near = boxSize / 100;
        // 计算远平面值
        this._camera.far = boxSize * 100;
        // 更新相机的投影矩阵
        this._camera.updateProjectionMatrix();
        
    }


    get changeBox3box() { 
        return this.isbox3Helper
    }
    get changeAxesHelper() { 
        return this.isAxesHelper
    }
    
    get changeSetModlseRotate() { 
        return this.modleRotateMap
    }
    
    // 添加模型动画
    animation(obj) { 
        obj.animations.forEach((anima, index) => {
            this.modleAnimateIndex[index] = this.modleAnimate?.clipAction(anima);
        });
        
    }

    modleAnimateChild(child: number, config?: any) {
        let iterationCount,
            speed; 
        
        if (!config || JSON.stringify(config) === '{}') {
            iterationCount = undefined;
            speed = undefined;

            // 设置对象不能为空
            if (JSON.stringify(config) === '{}') {
                throw new Error("参数错误：请传入正确参数");
            }
        } else { 
            iterationCount = config.iterationCount;
            speed = config.speed;
        }
        
        // 判断播放哪个动画
        for (const key in this.modleAnimateIndex) { 
            
            if (key === child.toString()) { 
                this.modleClipAction = this.modleAnimateIndex[key];

                this.modleClipAction.reset();  
                // 开始播放动画
                this.modleClipAction.play()

                // 动画循环方式
                if (iterationCount && iterationCount === 1) {
                    this.modleClipAction.loop = THREE.LoopOnce; 
                } else if (iterationCount && iterationCount === "infinite") { 
                    this.modleClipAction.loop = THREE.LoopRepeat;
                }

                // 播放速度
                if (iterationCount && (speed || speed === 0)) { 
                    this.modleClipAction.timeScale = speed
                }
            }
        }

    }


}
