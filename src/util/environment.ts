import * as THREE from 'three';

export function isMesh(obj: unknown): obj is THREE.Mesh {
	return (typeof obj === "object" && obj !== null && "isMesh" in obj);
}

export function isLight(obj: unknown): obj is THREE.Light {
	return obj instanceof THREE.Light;
}