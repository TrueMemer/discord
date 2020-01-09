import { IModule } from "./interfaces/IModule";
import { IEventHandler } from "./interfaces/IEventHandler";

export class Module implements Partial<IModule> {

    private _eventHandlers: IEventHandler[] = [];
    protected _disabled: boolean;

    public toggle(): void {
        this._disabled = !this._disabled;
    }

    public registerEventHandler(handler: IEventHandler) {
        this._eventHandlers.push(handler);
    }

    get eventHandlers() {
        if (this._disabled) return [];
        else return this._eventHandlers;
    }

}