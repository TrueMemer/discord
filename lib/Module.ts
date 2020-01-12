import { IModule } from "./interfaces/IModule";
import { IEventHandler } from "./interfaces/IEventHandler";

export class Module implements Partial<IModule> {

    private _eventHandlers: IEventHandler[] = [];
    public disabled: boolean = false;

    public toggle(): void {
        this.disabled = !this.disabled;
    }

    public registerEventHandler(handler: IEventHandler) {
        this._eventHandlers.push(handler);
    }

    get eventHandlers() {
        if (this.disabled) return [];
        else return this._eventHandlers;
    }

}