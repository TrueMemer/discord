import { IModule } from "../../../interfaces/IModule";
import ICommand from "../../../interfaces/ICommand";
import { Bot } from "../../../Bot";
import { Message } from "discord.js";
import { IEventHandler } from "../../../interfaces/IEventHandler";
import { CommanderModule } from "../../../extensions/commander.ext";

export class MessageHandler implements IEventHandler {
    public for: string = "message";
    public ignoreSelf: boolean = true;

    constructor(prefix: string) {
        this._prefix = prefix;
    }

    private _prefix: string;

    public listener = (ctx: Bot, msg: Message) => {
        if (this.ignoreSelf && msg.author.id === ctx.self.id)
            return;

        if (msg.content.startsWith(this._prefix)) {
            const [cmd, ...args] = msg.content.trim().slice(this._prefix.length).split(/\s+/g);

            let command: ICommand;

            ctx.modules.forEach((m) => {
                // If module is not commander module - ignore
                const module = <CommanderModule><unknown>m;
                if (!module.commands) return;

                const c = module.commands.find(c => c.name === cmd || (c.aliases && c.aliases.includes(cmd)));

                if (c) {
                    command = c;
                    return;
                }
            });

            if (!command) {
                msg.channel.send('Unknown command!');
                return;
            }

            command.handler(ctx, msg, cmd, args);
        }
    };
}