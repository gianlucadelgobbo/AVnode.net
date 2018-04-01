import {h, Component} from 'preact';
import LateralMenu from '../../lateralMenu'
import {FormattedMessage} from 'preact-intl';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";

const items = [
    {
        href: "/admin/crews/:_id/public",
        label: <FormattedMessage
            id="publicData"
            defaultMessage="Public data"
        />
    },
    {
        href: "/admin/crews/:_id/image",
        label: <FormattedMessage
            id="image"
            defaultMessage="Image"
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

export default MyLateralMenu;
