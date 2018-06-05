import React, {Component} from 'react';
import LateralMenu from '../../lateralMenu'
import {injectIntl, FormattedMessage} from 'react-intl';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const items = [
    {
        href: "/admin/performances/:_id/public",
        label: <FormattedMessage
            id="publicData"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/performances/:_id/image",
        label: <FormattedMessage
            id="images"
            defaultMessage="Images"
        />
    },
    {
        href: "/admin/performances/:_id/galleries",
        label: <FormattedMessage
            id="galleries"
            defaultMessage="Galleries"
        />
    },
    {
        href: "/admin/performances/:_id/videos",
        label: <FormattedMessage
            id="videos"
            defaultMessage="Videos"
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
