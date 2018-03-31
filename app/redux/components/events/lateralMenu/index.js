import {h, Component} from 'preact';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage} from 'preact-intl';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";

const items = [
    {
        href: "/admin/event/public",
        label: <FormattedMessage
            id="publicData"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/event/images",
        label: <FormattedMessage
            id="images"
            defaultMessage="Images"/>

    },
    {
        href: "/admin/event/emails",
        label: <FormattedMessage
            id="emails"
            defaultMessage="Emails"
        />

    },
    {
        href: "/admin/event/private",
        label: <FormattedMessage
            id="privateData"
            defaultMessage="Private data"
        />


    },
    {
        href: "/admin/event/password",
        label: <FormattedMessage
            id="password"
            defaultMessage="Password"
        />


    },
    {
        href: "/admin/event/connections",
        label: <FormattedMessage
            id="connections"
            defaultMessage="Connections"
        />


    },
];

class ProfileLateralMenu extends Component {
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

ProfileLateralMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileLateralMenu);

export default ProfileLateralMenu;
