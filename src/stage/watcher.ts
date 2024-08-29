import { Environment } from '../core/environment'
import { Events } from '../types'

export class Watcher {     
    // core: Core;
	// character: Character;
	// css_3d_renderer: Css3DRenderer;
	environment: Environment;
	// audio: Audio;
    // ray_caster_controls: RayCasterControls;
    
    constructor() { 
        this.environment = new Environment();

        // this.environment.$on(Events.ON_LOAD_PROGRESS, this._handleLoadProgress.bind(this));

        


    }

    update(delta: number) {
		// this.environment.
		if (this.environment.collider && this.environment.is_load_finish) {
			// this.css_3d_renderer.update();
			// this.character.update(delta, this.environment.collider);
			// this.ray_caster_controls.updateTooltipRayCast(this.environment.raycast_objects);
		}
	}
}