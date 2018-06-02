import React, {Component} from 'react';

class TitleComponent extends Component {

    render() {
        const { title, type } = this.props;
        return (
        <div className="titleComponent">
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h4>{title}</h4>
                    <div>{type}</div>
                </div> 
            </div>
        </div>);
    }
}

export default TitleComponent;