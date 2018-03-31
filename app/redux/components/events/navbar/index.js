import {h} from 'preact';
import {connect} from 'preact-redux';
import {navigate} from '../../../reducers/actions';
import {FormattedMessage} from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';
import Match from 'preact-router/match';

const eventNav = ({user, dispatch}) => {
    const classes = (url, path) => {
        //if (user.active.indexOf(path)==0) console.log('PrNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
        return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
    };

    return (
        <Match>
            {({url}) => <div>
                <nav id="account-sidenav" className="nav-justified pull-left">
                    <a
                        className={classes(url, '/admin/event/public')}
                        href="/admin/event/public"
                        onClick={e => {
                            dispatch(navigate('/admin/event/public'));
                        }}>
                        <FormattedMessage
                            id="publicData"
                            defaultMessage="Public data"
                        />
                    </a>
                    <a className={classes(url, '/admin/event/images')} href="/admin/event/images" onClick={e => {
                        dispatch(navigate('/admin/event/images'));
                    }}>
                        <FormattedMessage
                            id="images"
                            defaultMessage="Images"
                        />
                    </a>
                    <a className={classes(url, '/admin/event/emails')} href="/admin/event/emails" onClick={e => {
                        dispatch(navigate('/admin/event/emails'));
                    }}>
                        <FormattedMessage
                            id="emails"
                            defaultMessage="Emails"
                        />
                    </a>
                    <a className={classes(url, '/admin/event/private')} href="/admin/event/private" onClick={e => {
                        dispatch(navigate('/admin/event/private'));
                    }}>
                        <FormattedMessage
                            id="privateData"
                            defaultMessage="Private data"
                        />
                    </a>
                    <a className={classes(url, '/admin/event/password')} href="/admin/event/password"
                       onClick={e => {
                           dispatch(navigate('/admin/event/password'));
                       }}>
                        <FormattedMessage
                            id="password"
                            defaultMessage="Password"
                        />
                    </a>
                    <a className={classes(url, '/admin/event/connections')} href="/admin/event/connections"
                       onClick={e => {
                           dispatch(navigate('/admin/event/connections'));
                       }}>
                        <FormattedMessage
                            id="connections"
                            defaultMessage="Connections"
                        />
                    </a>
                </nav>
            </div>}
        </Match>

    );
};

const mapStateToProps = ({user}) => ({
    user: user
});

export default connect(mapStateToProps)(eventNav);
