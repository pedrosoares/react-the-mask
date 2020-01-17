import React from 'react';
import {mask, tokens} from 'vue-the-mask';
import masker from './masker';

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
            this.refresh(masker(this.props.value, this.config.mask, true, this.config.tokens));
        }
        mask(this.el.current, {value: this.config.mask});
        this.el.current.addEventListener('input', this.onInput); //For some reason OnChange is not Working
    }

    componentWillUnmount() {
        this.el.current.removeEventListener('input'); //For some reason OnChange is not Working
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
        const props = Object.assign({
            type: 'text'
        }, this.props, {
            ref: this.el,
            value: this.state.display,
            onChange: () => {}
        });

        delete props.children;

        return (<input {...props} />);
    }

}

export default TheMask;
