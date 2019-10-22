import React, { Component } from 'react';

export default class SubmitCostumizado extends Component {
    render() {
        return (
            <div className="pure-control-group">
                <button type="submit"
                        className="pure-button pure-button-primary btn-block">
                            {this.props.texto}
                </button>
            </div>
        )
    }
}