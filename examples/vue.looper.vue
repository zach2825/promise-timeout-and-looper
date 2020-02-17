<template>
    <div class="container">
        <div>
            <h1 class="title">
                testing
            </h1>
            <h2 class="subtitle">
                My neat Nuxt.js project to demo the promise-timeout-and-looper package

                <br>
            </h2>

            <p>
                check the browser dev console for information
            </p>
            <div class="links">
                <nuxt-link class="btn btn-primary" to="/test">
                    nav to testing page
                </nuxt-link>
                <button class="btn btn-primary" @click="this.start">
                    Loop start
                </button>
                <button class="btn btn-warning" @click="this.cancel">
                    Loop stop
                </button>
            </div>

            <br>

            <ul>
                <li v-for="number in numbers" v-html="number"></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Logo from '~/components/Logo.vue'
    import {looper} from 'promise-timeout-and-looper';

    export default {
        data() {
            return {
                loop: null,
                numbers: [],
            };
        },
        components: {
            Logo
        },
        methods: {
            async start() {
                this.numbers = [];
                console.log("starting");

                await this.loop.loopStart({
                    ms: 1000,
                    debug: true,
                    loop_tick_callback: async ({tickCount}) => {
                        this.numbers.push(tickCount);

                        if (tickCount === 5) {
                            return false;
                        }
                    }
                });

                console.log('done');
            },
            async cancel() {
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
</script>
