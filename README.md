# Promise timeout and looper
<p align="center">
<img src="images/promise-timeout-and-looper.png" alt="Promise timeout and looper">
</p>

An easy way to do looping ticks at a set time interval. Other ways to do this requires recursion. This package eliminates that.

You'll need to initialize the sleeper or looper to use it. That's done because you can cancel the timeout however you'd like. like in reacts componentWillUnmount or vue unmounted hook. You can see a few examples in the examples directory.

## Installation

```
npm install --save promise-timeout-and-looper
```

or

```
yarn add promise-timeout-and-looper
```

## Usage

### sleeper

adds an intuitive sleep method to your js projects

```js
// Import sleeper
const {sleeper} = require('promise-timeout-and-looper');

const test = async = () => {
    
    // Initialize the 5 second timeout
    const sleep_obj = sleeper(5000, {
        //optional
        debug: false, // default is false
        message: 'optional message here', // this messages is massed through the tick resolve. can be used to know which tick is resolving if you have multiple sleep_objects
    });
    
    // tick gets the it of setTimeout, message, the ms value, all previous ids of setTimeout, and tickCount. 
    const tick = await sleep_obj.tick();
    
    //this could also look like this in es syntax 
    // const {tickCount} = await sleep_obj.tick(); // on first run tickCount would equal 0
}
```

if you define the sleep_obj globally then you can cancel the running tick from anywhere at any time. So in like in react if you set the sleep_object in state in your *componentWillUnmount* hook you could add a call like 
this `this.state.sleep_obj && this.state.sleep_obj.cancel_timer()` that will invalidate the timer and call clearTimeout on the latest timer id in the registry.


You can find anohter example [here](__tests__/sleeper.test.js)

### looper

easy to use loop that adds in interval after your callback has resolved

Here is a code fragment in vue

```vue
import {looper} from 'promise-timeout-and-looper';

export default {
    data() {
        return {
            loop: null,
            numbers: [],
        };
    },
    methods: {
        async start() {
            this.numbers = [];
            console.log("starting");

            // loopStart returns a promise that resolves when loopCancel or loop_tick_callback returns false
            await this.loop.loopStart({
                debug: true, // optional defaults to false

                // required
                ms: 1000,
                loop_tick_callback: async (tick) => {
                    // tick gets the sleeper object plus if the tick is valid or not.
                    const {tickCount} = tick;
                    this.numbers.push(tickCount);

                    if (tickCount === 5) {
                        return false;
                    }
                }
            });

            console.log('done');
        },
        async cancel() {
            // cancels current tick
            this.loop && this.loop.loopCancel();
        },
    },
    mounted() {
        this.loop = looper;
    },
    beforeDestroy() {
        this.cancel();
    }
}
``` 

You can find a few examples of looper here
* [react](examples/react.looper.jsx)
* [vue](examples/vue.looper.vue)
* [test](__tests__/sleeper.test.js)
