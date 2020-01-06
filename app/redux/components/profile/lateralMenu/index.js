import React, {Component} from 'react';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage, injectIntl} from 'react-intl';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const items = [
    {
        href: "/admin/profile/public",
        label: <FormattedMessage
            id="publicDataProfile"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/profile/images",
        label: <FormattedMessage
            id="imageProfile"
            defaultMessage="Image"/>

    },
    {
        href: "/admin/profile/emails",
        label: <FormattedMessage
            id="emailsProfile"
            defaultMessage="Emails"
        />

    },
    {
        href: "/admin/profile/private",
        label: <FormattedMessage
            id="privateDataProfile"
            defaultMessage="Private data"
        />


    },
    {
        href: "/admin/profile/password",
        label: <FormattedMessage
            id="passwordProfile"
            defaultMessage="Password"
        />


    }/* ,
    {
        href: "/admin/profile/connections",
        label: <FormattedMessage
            id="connectionsProfile"
            defaultMessage="Connections"
        />


    }, */
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
