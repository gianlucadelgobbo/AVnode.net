import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {bindActionCreators} from "redux";
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {fetchList as fetchCrews} from "../crews/actions";
import {fetchList as fetchPerformances} from "../performances/actions";
import {fetchList as fetchEvents} from "../events/actions";
import {getList as getCrews} from "../crews/selectors";
import {getList as getPerformances} from "../performances/selectors";
import {getList as getEvents} from "../events/selectors";


class TopMenu extends Component {

    componentDidMount() {
        const {fetchCrews, fetchPerformances, fetchEvents} = this.props;
        fetchCrews();
        fetchPerformances();
        fetchEvents();
    }

    createMenuItem = ({model, index}) => {

        return (
            <Link href={model.href} activeClassName="active" className="nav-link" key={index}>
                {model.label} <span className="badge badge-pill badge-info">{model.counter}</span>
            </Link>);
    };

    render() {

        const {crews, performances, events} = this.props;

        const items = [
    {
        href : "/admin/profile/public",
        label : <FormattedMessage
            id="profile"
            defaultMessage="Profile"
        />
    },
    {
        href : "/admin/crews",
        counter : crews.length,
        label : <FormattedMessage
            id="crews"
            defaultMessage="Crews"
        />
    },
    {
        href : "/admin/performances",
        counter : performances.length,
        label : <FormattedMessage
            id="performances"
            defaultMessage="Performances"
        />
    }, {
        href : "/admin/events",
        counter : events.length,
        label : <FormattedMessage
            id="events"
            defaultMessage="Events"
        />
    },
    {
        href: "/admin/preferences",
        label: <FormattedMessage
            id="preferences"
            defaultMessage="Preferences"
        />
    },

];

        return (
            <nav id="account-nav" className="nav nav-pills nav-justified">
                {items.map((model, index) => this.createMenuItem({model, index}))}
            </nav>)
    }

}

const mapStateToProps = (state) => ({
    crews:getCrews(state),
    performances: getPerformances(state),
    events:getEvents(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCrews,
    fetchPerformances,
    fetchEvents
}, dispatch);

TopMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);

export default TopMenu;


//connect(mapStateToProps)(TopMenu);

//export default TopMenu;

