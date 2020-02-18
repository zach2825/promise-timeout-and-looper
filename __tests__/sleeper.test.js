'use strict';

const {sleeper, looper} = require('../index');

describe('sleeper', () => {
    it('the script should always take longer then the timeout to execute', async () => {
        const sleeper_obj = sleeper(2000);

        const start = new Date().getTime();

        await sleeper_obj.tick();

        const end = new Date().getTime();

        const time = end - start;

        expect(time).toBeGreaterThan(2000);
    });
});

describe('looper', () => {
    it('only execute for 1 second', async () => {

        const start = new Date().getTime();
        setTimeout(async () => await looper.loopCancel(), 1000);

        await looper.loopStart({
            ms: 100,

            loop_tick_callback: async ({/*tickCount*/}) => {
                // Do something here
            }
        });

        const end = new Date().getTime();

        const time = end - start;

        expect(time).toBeLessThan(1100);
    });

    it('execute 2 ticks with 2 seconds in between and have a 1 second wait in the tick', async () => {

        const start = new Date().getTime();

        let run_count = 0;

        await looper.loopStart({
            ms: 2000,

            debug: false,

            loop_tick_callback: async ({tickCount}) => {

                expect(tickCount).toEqual(run_count++);

                // 1 second timeout in each tick
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (tickCount === 1) {
                    return false; // auto cancels the loop.
                }
            }
        });

        const end = new Date().getTime();

        const time = end - start;
        expect(time).toBeGreaterThan(6000);
        expect(time).toBeLessThan(6100);
    });
});
