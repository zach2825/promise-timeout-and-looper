import React, {Component} from 'react';
import {looper} from "promise-timeout-and-looper";

/**
 * this example file is meant to show how the looper helper works.
 */
export default class Looper extends Component {
    state = {
        looper: null,
        numbers: [],
        debug: false,
    };

    componentDidMount() {
        // initialize the looper
        this.setState({looper: looper});
    }

    componentWillUnmount() {
        // Make sure the looper is canceled
        this.loopCancel();
    }

    loopStart = async () => {
        await this.setState({numbers: [1]});

        let max_run = 10;

        // tell this function to wait until the looping is done
        await this.state.looper.loopStart({
            // outputs debug information to the console
            debug: this.state.debug,

            // timeout in milliseconds between ticks
            ms: 500,

            // executes after the timeout
            loop_tick_callback: async () => {
                if (--max_run < 1) {
                    // this return false cancels the looper automatically
                    return false;
                }

                const {
                    numbers: {
                        [this.state.numbers.length - 1]: last_number = 0
                    },
                } = this.state;

                const numbers = this.state.numbers;
                numbers.push(last_number + 1);

                await this.setState({numbers});
            },
        });

        const numbers = this.state.numbers;
        numbers.push('Done looping');

        await this.setState({numbers});
    };

    loopCancel = () => {
        this.state.looper && this.state.looper.loopCancel({debug: true});
    };

    render() {
        return (
            <div>
                <div className="btn-group">
                    <button className="btn btn-primary marginB5" onClick={this.loopStart}>
                        Start looping
                    </button>

                    <button className="btn btn-warning marginB5" onClick={this.loopCancel}>
                        Stop looping
                    </button>
                </div>

                <ul className="marginT10">
                    {this.state.numbers.length > 0 ? <li>Starting</li> : null}
                    {this.state.numbers.map(n => <li>{n}</li>)}
                </ul>
            </div>
        )
    }
}
