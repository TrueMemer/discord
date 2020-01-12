import { Bot } from "../Bot";
import { IEventHandler } from "./IEventHandler";

export interface IModule {
    name: string;
    dependencies?: string[];
    optionalDependences?: string[];
    disabled: boolean;

    initialize(ctx: Bot): Promise<boolean>;
    registerEventHandler(handler: IEventHandler): void;

    toggle(): void;

    afterStart(ctx: Bot): void;

    eventHandlers: IEventHandler[];
}