# Promise timeout and looper
<p align="center">
<img src="images/promise-timeout-and-looper.png" alt="Promise timeout and looper">
</p>

An easy way to do looping ticks at a set time interval. Other ways to do this requires recursion. This package eliminates that.

You'll need to initialize the sleeper or looper to use it. That's done because you can cancel the timeout however you'd like. like in reacts componentWillUnmount or vue unmounted hook. You can see a few examples in the examples directory.

## Usage

### sleeper

adds an intuitive sleep method to your js projects

```js
const {sleeper} = require('promise-timeout-and-looper');

// 5 second timeout
(async () => {
    await sleeper(5000)
})
```

You can find anohter example in __tests__/sleeper.test.js

### looper

easy to use loop that adds in interval after your callback is done

You can find an example in __tests__/sleeper.test.js
