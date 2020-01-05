import React, {Component} from 'react';

class TitleComponent extends Component {

    render() {
        const { title, type, link, show } = this.props;
        return (
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{title}</h1>
                <div className="btn-toolbar mb-2 mb-md-0 d-print-none text-right">
                    <a className="btn btn-primary" href={link}>{show}</a>
                </div> 
            </div>);
    }
}

export default TitleComponent;