import React from 'react';
import {mask, tokens} from 'vue-the-mask';
import masker from './masker';

class TheMask extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            lastValue: "", // avoid unnecessary emit when has no change
            display: props.value || ""
        };

        this.config = {
            mask: props.mask,
            tokens: props.tokens || tokens,
            masked: props.masked || false // by default emits the value unformulated, change to true to format with the mask
        };

        this.el = React.createRef();
    }

    componentDidMount(){
        if(!!this.props.value){
            this.refresh(masker(this.props.value, this.config.mask, true, this.config.tokens));
        }
        mask(this.el.current, {value: this.config.mask});
        this.el.current.addEventListener('input', this.onInput);
    }

    componentWillUnmount() {
        this.el.current.removeEventListener('input');
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
        if(!!this.props.value){
            this.refresh(masker(this.props.value, this.config.mask, true, this.config.tokens));
        }

        let props = {
            type: 'text',
            ...this.props,
            ref: this.el,
            value: this.state.display,
            onChange: () => {},
            children: null
        };

        delete props.children;
        delete props.mask;

        return (<input {...props} />);
    }

}

export default TheMask;
