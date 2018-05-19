import React, {Component} from 'react';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage, injectIntl} from 'react-intl';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const items = [
    {
        href: "/admin/events/:_id/public",
        label: <FormattedMessage
            id="publicData"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/events/:_id/images",
        label: <FormattedMessage
            id="images"
            defaultMessage="Images"/>

    },
    {
        href: "/admin/events/:_id/partners",
        label: <FormattedMessage
            id="partners"
            defaultMessage="Partners"
        />

    },
    {
        href: "/admin/events/:_id/program",
        label: <FormattedMessage
            id="program"
            defaultMessage="Program"
        />

    },
    {
        href: "/admin/events/:_id/galleries",
        label: <FormattedMessage
            id="galleries"
            defaultMessage="Galleries"
        />
    },
    {
        href: "/admin/events/:_id/videos",
        label: <FormattedMessage
            id="videos"
            defaultMessage="Videos"
        />

    },
    {
        href: "/admin/events/:_id/calls",
        label: <FormattedMessage
            id="calls"
            defaultMessage="Calls"
        />

    },
    {
        href: "/admin/events/:_id/settings",
        label: <FormattedMessage
            id="setting"
            defaultMessage="Settings"
        />

    },
];

class MyLateralMenu extends Component {
    render() {
        const {_id} = this.props;

        return (
            <LateralMenu
                items={items}
                _id={_id}
            />
        )
    }

}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

MyLateralMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(MyLateralMenu);

export default injectIntl(MyLateralMenu);
