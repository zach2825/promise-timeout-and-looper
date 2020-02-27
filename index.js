'use strict';

const get = require('lodash/get');

/**
 * handle sleep in javascript using promises. Also add a few options to make this more useful
 * @param ms
 * @param options
 * @returns {{valid: boolean, timer: null, tickCount: (function(): number), cancel_timer: cancel_timer, id: *, tick: (function(): *), toObject: (function(): {valid: boolean, timer: null, registry: {valid: boolean, timers: [], tickCount: number}, tickCount: number, ms: *, message, hash: *})}}
 */
const sleeper = module.exports.sleeper = (ms, options) => {

    const message = get(options, 'message');
    const debug = get(options, 'debug', false);

    debug && console.log("sleeper.initialized");

    // Track history and current timeout values.
    const registry = {valid: true, tickCount: 0, timers: [], current_timer: {timer: null, cancel: null}};

    const tickCount = () => {
        const tickCount = get(registry, 'tickCount', 0);

        return tickCount;
    };

    const toObject = () => ({
        ms,
        message,
        timer: registry.timer,
        registry,
        valid: registry.valid,
        tickCount: tickCount(),
    });

    return {
        // property values
        valid: registry.valid,
        timer: registry.timer,
        tickCount,
        toObject,

        // functions
        cancel_timer: async () => {
            debug && console.log(`canceling.${registry.timer}`);
            clearTimeout(registry.timer);
            registry.timer = null;
            registry.valid = false;
            registry.current_timer && await registry.current_timer.cancel(registry);
        },
        tick: () => {
            const new_count = tickCount() + 1;

            registry.current_timer.promise = new Promise(resolve => {
                registry.current_timer.cancel = resolve;

                registry.timer = setTimeout(() => {
                    debug && console.log(`resolving.tick.${registry.timer}`);
                    resolve({message, ...toObject()});

                    registry.tickCount = new_count;
                }, ms);

                debug && console.log(`starting.tick.${registry.timer}`);

                registry.timers.push(registry.timer);
            });

            return registry.current_timer.promise;
        },
    };
};

function LooperConstructor() {
    // Defaults
    this.timer = null;
    this.tick = {valid: true};
    this.ms = 5000;
    this.debug = false;

    /**
     * cancel the loop in a safe way
     * @param options
     */
    this.loopCancel = async (options) => {
        const debug = get(options, 'debug', false);

        debug && console.log("looper.cancel");
        this.tick = {valid: false};
        this.timer && await this.timer.cancel_timer({debug});
    };

    /**
     *
     * @returns {Promise<void>}
     * @param options
     */
    this.loopStart = async (options) => {
        // callback to fire after each tick
        const loop_tick_callback = get(options, 'loop_tick_callback');
        // timeout between loop ticks
        const ms = get(options, 'ms', this.ms);
        // Debug information on each tick to the console
        const debug = get(options, 'debug', this.debug);

        debug && console.log('loopStart.called', {loop_tick_callback, ms, debug});

        this.timer = sleeper(ms, {identifier: 'looper@loop-start', debug: debug});
        this.tick = {valid: true};

        while (this.tick.valid) {
            // Await here as a workaround to sleep in js for a new seconds.
            // use this to avoid using recursion
            this.tick = await this.timer.tick();

            if (this.tick.valid) {

                debug && console.log('loopStart.tick.done', this.tick, this.tick.valid ? 'is valid' : 'is not valid');

                // only show the loading state on the first loop iteration. pass the tick object into the callback function
                const response = await loop_tick_callback(this.tick);

                // The last callback returned false. This means that the looping should cancel.
                if (response === false) {
                    this.loopCancel({debug});
                }
            } else {
                this.loopCancel({debug});
            }

        }
    }
}

module.exports.looper = new LooperConstructor();
