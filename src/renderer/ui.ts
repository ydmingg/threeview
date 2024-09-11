import { Events } from "../types";
import { Stage } from "../stage";

export class UI {
    private _opts: Stage;
    private _stage: Stage;

	private doms: {
		/* 初始加载进度相关 */
		loading: HTMLElement;
		loading_complete: HTMLElement;
	};

    constructor(opts: any) {
        this._opts = opts;
        this._stage = new Stage(this._opts);

		this.doms = {
			loading: document.querySelector(".loading")!,
			loading_complete: document.querySelector(".loading-complete")!,
			
        };
    }
    
	updateLoadingProgress(loading_text: string) {
		const progress = this.doms.loading.querySelector(".progress");
		progress && (progress.textContent = loading_text);
	}

	removeLoading() {
		this.doms.loading.remove();
    }
    
}
