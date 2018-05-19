import React, { Component } from 'react';

class ItemNotFound extends Component {

    render() {

        const {ItemNotFound} = this.props;

        return (
            <div className="row">
                <div className="col-md-12">
                    Item not found
                </div>
            </div>
        );
    }
}

export default ItemNotFound;