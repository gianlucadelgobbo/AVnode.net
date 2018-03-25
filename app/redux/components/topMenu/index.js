import {h, Component} from 'preact';
import {FormattedMessage} from 'preact-intl';
import {Link} from 'preact-router/match';
import {connect} from 'preact-redux';

const items = [
    {
        href: "/admin/profile/public",
        label: <FormattedMessage
            id="profile"
            defaultMessage="Profile"
        />
    },
    {
        href: "/admin/crews",
        label: <FormattedMessage
            id="crews"
            defaultMessage="Crews"
        />
    },
    {
        href: "/admin/performances",
        label: <FormattedMessage
            id="performances"
            defaultMessage="Performances"
        />
    }, {
        href: "/admin/events",
        label: <FormattedMessage
            id="events"
            defaultMessage="Events"
        />
    },
    {
        href: "/admin/preferences",
        label: <FormattedMessage
            id="preferences"
            defaultMessage="Preferences"
        />
    },

];

class TopMenu extends Component {

    createMenuItem = ({model, index}) => {

        return (
            <Link href={model.href} activeClassName="active" className="nav-link" key={index}>
                <span className="badge badge-pill badge-default">99</span> {model.label}
            </Link>);
    };

    render() {

        return (
            <nav id="account-nav" className="nav nav-pills nav-justified">
                {items.map((model, index) => this.createMenuItem({model, index}))}
            </nav>)
    }

}

const mapStateToProps = ({user}) => ({
    user: user
});

connect(mapStateToProps)(TopMenu);

export default TopMenu;
