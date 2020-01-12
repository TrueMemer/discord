import { Client, ClientUser } from 'discord.js';
import { IModule } from './interfaces/IModule';
import { Commander } from './modules/commander';

export declare type BotOptions = {
    token: string,
    ignoreSelf?: boolean,
    prefix?: string,
    enableCommander?: boolean
};

export class Bot {

    private _client: Client;
    private _commander: Commander;
    private _modules: Map<string, IModule> = new Map;

    public get self(): ClientUser { return this._client.user; };
    public get modules(): Map<string, IModule> { return this._modules; }

    private async _onEvent(event: string | symbol, args: any[]) {
        if (!['debug', 'raw'].includes(event.toString()))
            console.log(`[bot][event:${event.toString()}] ${args}`);

        if (event == 'ready') {
            this._modules.forEach(async (m) => {
                m.afterStart(this);
            });

            return;
        }

        if (event === 'message') {
            if (this._commander) {
                this._commander.eventHandlers.forEach((v) => v.listener(this, ...args));
            }
        }

        this._modules.forEach(async (m) => {
            const events = m.eventHandlers.filter((v) => v.for === event);
            if (events.length != 0) {
                events.forEach((v) => v.listener(this, ...args));
            }
        });
    }

    constructor(options: BotOptions) {
        this._client = new Client();

        // Patch to recieve all events
        const oldEmit = this._client.emit;

        this._client.emit = (event, ...args) => {
            this._onEvent(event, args);
            return oldEmit.apply(event, args);
        };

        this._client.token = options.token;

        if (options.enableCommander) {
            this._commander = new Commander(options.prefix || '!');
        }
    }

    public registerModule(module: IModule) {

        if (module.dependencies) {
            let canLoad = true;
            let missingDependencies: string[] = [];

            for (const d of module.dependencies) {
                if (!this._modules.has(d)) {
                    canLoad = false;
                    missingDependencies.push(d);
                }
            }

            if (!canLoad) {
                console.log(`[bot] failed to load module '${module.name}' due to missing dependencies: ${missingDependencies.join(',')}`);
                return;
            }
        }

        if (module.optionalDependences) {
            let missingDependencies: string[] = [];

            for (const d of module.optionalDependences) {
                if (!this._modules.has(d)) {
                    missingDependencies.push(d);
                }
            }

            console.warn(`[bot][warning] module '${module.name} misses some optional dependencies: ${missingDependencies.join(',')}'`);
        }

        this._modules.set(module.name, module);
        module.initialize(this);
        console.log(`[bot] registered module ${module.name}`);
    }

    public async start() {
        await this._client.login();
    }

};