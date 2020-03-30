import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

class RemoveModal extends Component {

    onRemove() {
        const {onRemove, hideModal} = this.props;

        const promise = onRemove();

        if (promise && typeof promise.then === "function") {
            promise.then(hideModal, hideModal)
        } else {
            hideModal();
        }
    }

    render() {

        const {hideModal} = this.props;
        return (<div className="text-right">
            <Button bsStyle="default" className="mr-3" onClick={hideModal}>Close</Button>
            <Button bsStyle="danger" onClick={this.onRemove.bind(this)}>Remove</Button>
        </div>);
    }
}

export default RemoveModal;
