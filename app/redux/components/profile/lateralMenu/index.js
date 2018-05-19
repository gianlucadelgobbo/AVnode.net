import React, {Component} from 'react';
import LateralMenu from '../../lateralMenu'
import {defineMessages, injectIntl} from 'react-intl';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const items = [
    {
        href: "/admin/profile/public",
        label: defineMessages({
            id: "publicData",
            defaultMessage: "Public data"
        })

    },
    {
        href: "/admin/profile/images",
        label: defineMessages({
            id: "images",
            defaultMessage: "Images"
        })

    },
    {
        href: " /admin/profile/emails",
        label: defineMessages({
            id: "emails",
            defaultMessage: "Emails"
        })

    },
    {
        href: "/admin/profile/private",
        label: defineMessages({
            id: "privateData",
            defaultMessage: "Private data"
        })

    },
    {
        href: "/admin/profile/password",
        label: defineMessages({
            id: "password",
            defaultMessage: "Password"
        })

    },
    {
        href: "/admin/profile/connections",
        label: defineMessages({
            id: "connections",
            defaultMessage: "Connections"
        })

    },
];

class MyLateralMenu extends Component {
    render() {
        return (
            <LateralMenu
                items={items}
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
