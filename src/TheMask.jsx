import React from 'react';
import {mask, tokens, masker} from 'vue-the-mask';

class TheMask extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            lastValue: "", // avoid unecessary emit when has no change
            display: props.value || ""
        };

        this.config = {
            mask: props.mask,
            tokens: props.tokens || tokens,
            masked: props.masked || false // by default emits the value unformatted, change to true to format with the mask
        };

        this.el = React.createRef();
    }

    componentDidMount(){
        if(!!this.props.value){
            this.setState({display: this.props.value});
        }
        mask(this.el.current, {value: this.config.mask});
    }

    onInput = (e) => {
        if (e.isTrusted) return; // ignore native event
        this.refresh(e.target.value);
    };

    refresh = (value) => {
        this.setState({display: value});
        let val = masker(value, this.config.mask, this.config.masked, this.config.tokens);
        if (val !== this.state.lastValue) {
            this.setState({lastValue: val});
            if(!!this.props.onChange) {
                this.props.onChange(val);
            }
        }
    };

    render(){
        return (<input type="text" ref={this.el} value={this.state.display} onChange={this.onInput} />);
    }

}

export default TheMask;
