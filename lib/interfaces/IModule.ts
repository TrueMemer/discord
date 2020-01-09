import { Bot } from "../Bot";
import { IEventHandler } from "./IEventHandler";

export interface IModule {
    name: string;

    initialize(ctx: Bot): Promise<boolean>;
    registerEventHandler(handler: IEventHandler): void;

    afterStart(ctx: Bot): void;

    eventHandlers: IEventHandler[];
}