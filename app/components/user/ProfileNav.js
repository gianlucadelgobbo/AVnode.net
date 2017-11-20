import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const ProfileNav = ({ user, dispatch, url }) => {
    let id = url.substring(url.lastIndexOf('/') + 1);
    const classes = (path) => {
        console.log('PrNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
        return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link'
    }

    return (
        <div>
            <pre>ProfileNav:{user.active} URL:{url}</pre>
            <nav id="account-sidenav" class="nav-justified pull-left">
                <a className={classes('/account/profile')} href="/account/profile" onClick={e => { dispatch(navigate('/account/profile')); }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/account/profile/images')} href="/account/profile/images" onClick={e => { dispatch(navigate('/account/profile/images')); }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/account/profile/emails')} href="/account/profile/emails" onClick={e => { dispatch(navigate('/account/profile/emails')); }}>
                    <FormattedMessage
                        id="password"
                        defaultMessage="Password"
                    />
                </a>
                <a className={classes('/account/profile/connections')} href="/account/profile/connections" onClick={e => { dispatch(navigate('/account/profile/connections')); }}>
                    <FormattedMessage
                        id="connections"
                        defaultMessage="Connections"
                    />
                </a>
            </nav>
        </div>
    );
};

const mapStateToProps = ({ user }) => ({
    user: user
});

export default connect(mapStateToProps)(ProfileNav);
