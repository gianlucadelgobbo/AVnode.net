import React, {Component} from 'react';

class TitleComponent extends Component {

    render() {
        const { title, type, link, show } = this.props;
        return (
        <div className="titleComponent">
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10">
                            <h2>{title}</h2>
                            <h6>{type}</h6>
                        </div> 
                        <div className="col-md-2 text-right">
                            <a className="btn btn-primary" href={link}>{show}</a>
                        </div> 
                    </div> 
                </div> 
            </div>
        </div>);
    }
}

export default TitleComponent;