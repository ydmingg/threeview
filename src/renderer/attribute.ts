import * as THREE from 'three'
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Stage } from '../stage'
import { CharacterParams } from '../types'
import { Events } from '../types'

export class Attribute { 
    private _stage: Stage
    private attribute!: THREE.Mesh<RoundedBoxGeometry, THREE.MeshBasicMaterial>
    private capsule_info = { // 胶囊体数据
		radius: 1,
		segment: new THREE.Line3(
			new THREE.Vector3(),
			new THREE.Vector3(0, -5, 0.0)
		)
	};
    
    private reset_position: THREE.Vector3; // 重生点
    private player_is_on_ground = false; // 是否在地面
    private velocity = new THREE.Vector3();

    private temp_vector = new THREE.Vector3();
	private temp_vector2 = new THREE.Vector3();
    private temp_mat = new THREE.Matrix4();
    private temp_box = new THREE.Box3();
    private temp_segment = new THREE.Line3();

    constructor(opts: any, reset_position: any) {
        this._stage = new Stage(opts)
        this.reset_position = reset_position;
        // this._stage.$on(Events.ON_KEY_DOWN, this._onKeyDown.bind(this));
        
        this._createCharacter();
        
    }

    update(delta_time: number, collider: THREE.Mesh, { 
        reset_y = -25,
        gravity = -50
    }: CharacterParams) {
		this._updateOrbitControls();

		this._updateCharacter(delta_time, gravity);

		this._checkCollision(delta_time, collider);

		// 调整相机视角
		this._stage.camera.position.sub(this._stage.orbit_controls.target);
		this._stage.orbit_controls.target.copy(this.attribute.position);
		this._stage.camera.position.add(this.attribute.position);

        this._checkReset(reset_y);
	}

    private _createCharacter() {
		this.attribute = new THREE.Mesh(
			new RoundedBoxGeometry(0.5, 2.5, 0.5, 10, 1),
			new THREE.MeshBasicMaterial({color: 0x0000ff})
		);
		this.attribute.geometry.translate(0, -0.25, 0);
		this.attribute.position.copy(this.reset_position);
		this.attribute.visible = false;
		this._stage.scene.add(this.attribute);
    }
    
    // 掉落地图检测
    private _checkReset(reset_y: any) {
		if (this.attribute.position.y < reset_y) {
			this._reset();
		}
    }
    
    private _reset() {
		this.velocity.set(0, 0, 0);
		this.attribute.position.copy(this.reset_position);
		this._stage.camera.position.sub(this._stage.orbit_controls.target);
		this._stage.orbit_controls.target.copy(this.attribute.position);
		this._stage.camera.position.add(this.attribute.position);
		this._stage.orbit_controls.update();
    }
    
    private _updateCharacter(delta_time: number, gravity: any) {
		this.velocity.y += this.player_is_on_ground ? 0 : delta_time * gravity;
		this.attribute.position.addScaledVector(this.velocity, delta_time);
		const angle = this._stage.orbit_controls.getAzimuthalAngle();

		// if (this._stage.control_manage.mode === "pc") { // 根据PC端操作移动角色方位
		// 	if (this._stage.control_manage.key_status["KeyW"]) {
		// 		this.temp_vector.set(0, 0, -1).applyAxisAngle(this.up_vector, angle);
		// 		this.attribute.position.addScaledVector(this.temp_vector, this.speed * delta_time);
		// 	}

		// 	if (this._stage.control_manage.key_status["KeyS"]) {
		// 		this.temp_vector.set(0, 0, 1).applyAxisAngle(this.up_vector, angle);
		// 		this.attribute.position.addScaledVector(this.temp_vector, this.speed * delta_time);
		// 	}

		// 	if (this._stage.control_manage.key_status["KeyA"]) {
		// 		this.temp_vector.set(-1, 0, 0).applyAxisAngle(this.up_vector, angle);
		// 		this.attribute.position.addScaledVector(this.temp_vector, this.speed * delta_time);
		// 	}

		// 	if (this._stage.control_manage.key_status["KeyD"]) {
		// 		this.temp_vector.set(1, 0, 0).applyAxisAngle(this.up_vector, angle);
		// 		this.attribute.position.addScaledVector(this.temp_vector, this.speed * delta_time);
		// 	}
		// } else { // 根据移动端操作移动角色方位
		// 	const degree = this._stage.control_manage.move_degree;
		// 	if (degree) {
		// 		const angle = (degree - 90) * (Math.PI / 180);
		// 		this.temp_vector.set(0, 0, -1).applyAxisAngle(this.up_vector, angle);
		// 		this.temp_vector.applyQuaternion(this._stage.camera.quaternion);
		// 		this.attribute.position.addScaledVector(this.temp_vector, this.speed * delta_time);
		// 	}
        // }
        
		this.attribute.updateMatrixWorld();
    }
    
    private _checkCollision(delta_time: number, collider: THREE.Mesh) {
        // 根据碰撞来调整player位置
        const capsule_info = this.capsule_info;
        this.temp_box.makeEmpty();
        this.temp_mat.copy(collider.matrixWorld).invert();
        this.temp_segment.copy(capsule_info.segment);

        // 获取胶囊体在对撞机局部空间中的位置
        this.temp_segment.start.applyMatrix4(this.attribute.matrixWorld).applyMatrix4(this.temp_mat);
        this.temp_segment.end.applyMatrix4(this.attribute.matrixWorld).applyMatrix4(this.temp_mat);

        // 获取胶囊体的轴对齐边界框
        this.temp_box.expandByPoint(this.temp_segment.start);
        this.temp_box.expandByPoint(this.temp_segment.end);

        this.temp_box.min.addScalar(-capsule_info.radius);
        this.temp_box.max.addScalar(capsule_info.radius);

        collider.geometry?.boundsTree?.shapecast({
            intersectsBounds: box => box.intersectsBox(this.temp_box),
            intersectsTriangle: tri => {
                // 检查场景是否与胶囊相交，并调整
                const tri_point = this.temp_vector;
                const capsule_point = this.temp_vector2;

                const distance = tri.closestPointToSegment(this.temp_segment, tri_point, capsule_point);
                if (distance < capsule_info.radius) {
                    const depth = capsule_info.radius - distance;
                    const direction = capsule_point.sub(tri_point).normalize();

                    this.temp_segment.start.addScaledVector(direction, depth);
                    this.temp_segment.end.addScaledVector(direction, depth);
                }
            }
        });
    }

    private _updateOrbitControls() {
		this._stage.orbit_controls.maxPolarAngle = Math.PI;
		this._stage.orbit_controls.minDistance = 1e-4;
		this._stage.orbit_controls.maxDistance = 1e-4;
	}

}