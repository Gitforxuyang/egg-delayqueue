import * as amqp from 'amqplib'

interface EggAmqpOption {
    [x: string]: any
    url?: string
    connectOptions?: amqp.Options.Connect
    socketOptions?: any
}

interface EggAmqpOptions {
    client?: EggAmqpOption
    clients?: {
        [x: string]: EggAmqpOption
    }
}

interface EggAmqpFun {
    (str: string): amqp.Connection
}

interface EggAmqpGet {
    get: EggAmqpFun
}

declare module 'egg' {
    // extend app
    interface Application {
        delayqueue: EggAmqpGet
    }

    // extend your config
    interface EggAppConfig {
        delayqueue: EggAmqpOptions
    }
}
