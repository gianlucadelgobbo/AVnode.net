import React, { Component } from 'react';
import LateralMenu from '../../lateralMenu'
import {defineMessages, injectIntl} from 'react-intl';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const items = [
    {
        href: "/admin/crews/:_id/public",
        label: defineMessages({
            id: "publicData",
            defaultMessage: "Public data"
        })
    },
    {
        href: "/admin/crews/:_id/images",
        label: <FormattedMessage
            id="images"
            defaultMessage="Images"
        />
    },
    {
        href: "/admin/crews/:_id/members",
        label: <FormattedMessage
            id="members"
            defaultMessage="Members"
        />

    },
    {
        href: "/admin/crews/:_id/organization",
        label: <FormattedMessage
            id="organization"
            defaultMessage="Organization"
        />

    }
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
