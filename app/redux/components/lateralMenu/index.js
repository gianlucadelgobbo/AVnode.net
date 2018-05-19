import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class LateralMenu extends Component {

    createHref({href}) {
        const {_id} = this.props;
        return _id ? href.replace(':_id', _id) : href;
    }

    createMenuItem = ({model, index}) => {

        return (
            <Link href={this.createHref({href: model.href})} activeClassName="active" className="nav-link" key={index}>
                {model.label}
            </Link>);
    };

    render() {

        const {items = []} = this.props;

        return (
            <nav id="account-sidenav" className="nav-justified pull-left">
                {items.map((model, index) => this.createMenuItem({model, index}))}
            </nav>)
    }

}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

LateralMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(LateralMenu);

export default LateralMenu;
