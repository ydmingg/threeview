import Evter from "evter";

export class Event {
    private _evter: Evter;

    constructor() { 
        this._evter = new Evter();
    }

    $on(name: string, handler: (...args: any[]) => void) {
		this._evter.on(name, handler);
	}

	$emit(name: string, ...args: any[]) {
		this._evter.emit(name, args);
	}

	$off(name: string, handler?: (...args: any[]) => void) {
		this._evter.off(name, handler);
	}
    
}
