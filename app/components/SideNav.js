import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const SideNav = ({ user, dispatch, url }) => {
    let id;
    const classes = (path) => {
        return (user.active === path) ? 'nav-link active' : 'nav-link'
    }
    const visible = (path) => {
        if (user.active.indexOf(path) > -1) {
            id = user.active.substring(user.active.lastIndexOf('/') + 1);
            //console.log('--> user'+ JSON.stringify(user));
            console.log('SIDENAV--> user.active:'+user.active +' url:'+url +' path:'+path +' id:'+id +' found:'+user.active.indexOf(path));
        }
        return (user.active.indexOf(path) > -1)
    }
    return (
        <div>
        <nav id="account-sidenav" class="nav-pills nav-justified pull-left">
            {visible('/account/profile') ?
                <div>
                    <a className={classes('/account/profile/public')} href="/account/profile/public" onClick={e => { dispatch(navigate('/account/profile/public')); }}>
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
                            id="emails"
                            defaultMessage="Emails"
                        />
                    </a>
                    <a className={classes('/account/profile/private')} href="/account/profile/private" onClick={e => { dispatch(navigate('/account/profile/private')); }}>
                        <FormattedMessage
                            id="privateData"
                            defaultMessage="Private data"
                        />
                    </a>
                    <a className={classes('/account/profile/password')} href="/account/profile/password" onClick={e => { dispatch(navigate('/account/profile/password')); }}>
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
                </div>
                : null
            }
        </nav>
        </div>
    );
};

const mapStateToProps = ({ user }) => ({
    user: user
});

export default connect(mapStateToProps)(SideNav);
