import {h, Component} from 'preact';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage} from 'preact-intl';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";
import {Link} from 'preact-router/match';

const items = [
    {
        href: "/admin/profile/public",
        label: <FormattedMessage
            id="publicData"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/profile/images",
        label: <FormattedMessage
            id="images"
            defaultMessage="Images"/>

    },
    {
        href: "/admin/profile/emails",
        label: <FormattedMessage
            id="emails"
            defaultMessage="Emails"
        />

    },
    {
        href: "/admin/profile/private",
        label: <FormattedMessage
            id="privateData"
            defaultMessage="Private data"
        />


    },
    {
        href: "/admin/profile/password",
        label: <FormattedMessage
            id="password"
            defaultMessage="Password"
        />


    },
    {
        href: "/admin/profile/connections",
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
