export interface IEventHandler {
    for: string;
    listener: Function;
    ignoreSelf?: boolean;
}

export class EventHandler implements Partial<IEventHandler> {
    for: string;
    protected _ctx: any;
    
    constructor(ctx: any) {
        this._ctx = ctx;
    }

}