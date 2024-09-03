import { Stage } from "../stage";
import * as THREE from "three";
import { Events } from "../types";

export class RayCasterControls {
	private _stage: Stage;
	click_raycaster: THREE.Raycaster;
	tooltip_raycaster: THREE.Raycaster;
	hover_point: THREE.Vector2;
	mouse_point: THREE.Vector2;

	constructor(opts: any) {
		this._stage = new Stage(opts);

		this.click_raycaster = new THREE.Raycaster();
		// 通过click点击检测距离为18
		this.click_raycaster.far = 18;

		this.tooltip_raycaster = new THREE.Raycaster();
		// tooltip显示检测距离为15
		this.tooltip_raycaster.far = 15;

		this.hover_point = new THREE.Vector2(0, 0);
		this.mouse_point = new THREE.Vector2();
	}

	updateTooltipRayCast(raycast_objects: THREE.Object3D[] = []) {
		if (raycast_objects.length) {
			this.tooltip_raycaster.setFromCamera(this.hover_point, this._stage.camera);
			const intersects = this.tooltip_raycaster.intersectObjects(raycast_objects);
			if (intersects.length && intersects[0].object.userData.title) {
				this._stage.$emit(Events.ON_SHOW_TOOLTIP, {msg: intersects[0].object.userData.title, show_preview_tips: !!intersects[0].object.userData.show_boards});
			} else {
				this._stage.$emit(Events.ON_HIDE_TOOLTIP);
			}
		}
	}

	bindClickRayCastObj(raycast_objects: THREE.Object3D[] = []) {
		let down_x = 0;
		let down_y = 0;

		document.body.addEventListener("pointerdown", (event) => {
			down_x = event.screenX;
			down_y = event.screenY;
		});

		document.body.addEventListener("pointerup", (event) => {
			const offset_x = Math.abs(event.screenX - down_x);
			const offset_y = Math.abs(event.screenY - down_y);

			// 点击偏移量限制
			if (offset_x <= 1 && offset_y <= 1 && event.target instanceof HTMLCanvasElement) {
				this.mouse_point.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse_point.y = -((event.clientY / window.innerHeight) * 2 - 1);

				this.click_raycaster.setFromCamera(this.mouse_point, this._stage.camera);
				const intersects = this.click_raycaster.intersectObjects(raycast_objects);
				if (intersects.length && intersects[0].object.userData.show_boards) {
					this._stage.$emit(Events.ON_CLICK_RAY_CAST, intersects[0].object);
				}
			}
		});
	}
}
