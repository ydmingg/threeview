import * as THREE from 'three'
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Stage } from '../stage'
import { CharacterParams } from '../types'



export class Attribute { 
    private _stage: Stage
    private attribute!: THREE.Mesh<RoundedBoxGeometry, THREE.MeshBasicMaterial>
    
    private reset_position: THREE.Vector3; // 重生点

    constructor(opts: any, { 
        reset_position = new THREE.Vector3(0, 5, 0),
    }: CharacterParams) {
        this._stage = new Stage(opts)
        this.reset_position = reset_position;
        
    }


}