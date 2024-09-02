import * as THREE from "three";
import { Stage } from "../stage";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";

export class Audio {
	private _stage: Stage;
	private audio_mesh: THREE.Mesh | undefined;
	private positional_audio: THREE.PositionalAudio | undefined;

	constructor(otps: any) {
		this._stage = new Stage(otps);
	}

    async createAudio(data: any) {
		this.audio_mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
		this.audio_mesh.position.set(-15.9, 4.49, 36.42);
		this.audio_mesh.visible = false;
		this._stage.scene.add(this.audio_mesh);

		const listener = new THREE.AudioListener();

		this._stage.camera.add(listener);
		this.positional_audio = new THREE.PositionalAudio(listener);
		this.audio_mesh.add(this.positional_audio);
        
        
		const buffer = await this._stage.loader.audio_loader.loadAsync(data.audio.background);
		this.positional_audio.setBuffer(buffer);
		this.positional_audio.setVolume(0.8);
		this.positional_audio.setRefDistance(2);
		this.positional_audio.setDirectionalCone(180, 230, 0.5);
		this.positional_audio.setLoop(true);

		const helper = new PositionalAudioHelper(this.positional_audio);
		this.positional_audio.add(helper);

		return Promise.resolve();
	}

	playAudio() {
		this.positional_audio?.play();
	}
}
