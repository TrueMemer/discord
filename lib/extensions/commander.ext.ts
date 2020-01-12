import { Module } from "../Module";
import { IModule } from "../interfaces/IModule";
import ICommand from "../interfaces/ICommand";

export interface ICommanderModule extends IModule {
    registerCommand(command: ICommand): void;

    commands: ICommand[];
}

export class CommanderModule extends Module {

    private _commands: ICommand[] = [];

    public registerCommand(command: ICommand) {
        this._commands.push(command);
    }

    get commands() {
        if (this.disabled) return [];
        else return this._commands;
    }
}

export class Command implements Partial<ICommand> {
    name: string;
    protected _ctx: any;

    constructor(ctx: any) {
        this._ctx = ctx;
    }
}