import { CommanderModule } from "../../extensions/commander.ext";
import { MessageHandler } from "./listeners/message.listener";

export class Commander extends CommanderModule {

    name: string = "commander";

    constructor(prefix: string) {
        super();
        
        this.registerEventHandler(new MessageHandler(prefix));
    }

}