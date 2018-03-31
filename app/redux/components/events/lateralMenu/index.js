import {h, Component} from 'preact';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage} from 'preact-intl';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";

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
        href: "/admin/events/:_id/users",
        label: <FormattedMessage
            id="users"
            defaultMessage="Users"
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
        href: "/admin/events/:_id/setting",
        label: <FormattedMessage
            id="setting"
            defaultMessage="Setting"
        />

    },
];

class ProfileLateralMenu extends Component {
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

ProfileLateralMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileLateralMenu);

export default ProfileLateralMenu;
