import React, {Component} from 'react';

class TitleComponent extends Component {

    render() {
        const { title, type } = this.props;
        return (
        <div className="titleComponent">
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h2>{title}</h2>
                    <h6>{type}</h6>
                </div> 
            </div>
        </div>);
    }
}

export default TitleComponent;