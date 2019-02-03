import React, {Component} from 'react';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage, injectIntl} from 'react-intl';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const items = [
    {
        href: "/admin/events/:_id/public",
        label: <FormattedMessage
            id="publicDataEvents"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/events/:_id/images",
        label: <FormattedMessage
            id="imagesEvents"
            defaultMessage="Image"/>

    },
   /*  {
        href: "/admin/events/:_id/partners",
        label: <FormattedMessage
            id="partnersEvents"
            defaultMessage="Partners"
        />

    }, */
    {
        href: "/admin/events/:_id/program",
        label: <FormattedMessage
            id="programEvents"
            defaultMessage="Program"
        />

    },
    {
        href: "/admin/events/:_id/galleries",
        label: <FormattedMessage
            id="galleriesEvents"
            defaultMessage="Galleries"
        />
    },
    {
        href: "/admin/events/:_id/videos",
        label: <FormattedMessage
            id="videosEvents"
            defaultMessage="Videos"
        />

    },
    /* {
        href: "/admin/events/:_id/calls",
        label: <FormattedMessage
            id="callsEvents"
            defaultMessage="Calls"
        />

    }, */
    {
        href: "/admin/events/:_id/settings",
        label: <FormattedMessage
            id="settingEvents"
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
