# Promise timeout and looper
<p align="center">
![Promise timeout and looper](images/promise-timeout-and-looper.png)   
</p>
An easy way to do looping ticks at a set time interval. Other ways to do this requires recursion. This package eliminates that.

You'll need to initialize the sleeper to use it as stand alone. That's done because you can cancel the timeout from other parts of your application. like in reacts componentWillUnmount or vue unmounted hook

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

You can find an example in __tests__/sleeper.test.js

### looper

easy to use loop that adds in interval after your callback is done

You can find an example in __tests__/sleeper.test.js
