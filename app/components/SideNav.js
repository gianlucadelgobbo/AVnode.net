import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const SideNav = ({ user, dispatch }) => {
    const classes = (path) => {
        return (user.active === path) ? 'nav-link active' : 'nav-link'
    }
    const visible = (path) => {
        console.log('--> user.active:'+user.active +' path:'+path +' found:'+user.active.indexOf(path));
        return (user.active.indexOf(path) > -1)
    }
    return (
        <nav id="account-sidenav" class="nav-pills nav-justified pull-left">
            {visible('/account/profile') ?
                <div>
                    <a className={classes('/account/profile')} href="/account/profile" onClick={e => { dispatch(navigate('/account/profile')) }}>
                        <FormattedMessage
                            id="publicData"
                            defaultMessage="Public data"
                        />
                    </a>
                    <a className={classes('/account/profile/images')} href="/account/profile/images" onClick={e => { dispatch(navigate('/account/profile/images')) }}>
                        <FormattedMessage
                            id="images"
                            defaultMessage="Images"
                        />
                    </a>
                    <a className={classes('/account/profile/emails')} href="/account/profile/emails" onClick={e => { dispatch(navigate('/account/profile/emails')) }}>
                        <FormattedMessage
                            id="emails"
                            defaultMessage="Emails"
                        />
                    </a>
                    <a className={classes('/account/profile/private')} href="/account/profile/private" onClick={e => { dispatch(navigate('/account/profile/private')) }}>
                        <FormattedMessage
                            id="privateData"
                            defaultMessage="Private data"
                        />
                    </a>
                    <a className={classes('/account/profile/password')} href="/account/profile/password" onClick={e => { dispatch(navigate('/account/profile/password')) }}>
                        <FormattedMessage
                            id="password"
                            defaultMessage="Password"
                        />
                    </a>
                    <a className={classes('/account/profile/connections')} href="/account/profile/connections" onClick={e => { dispatch(navigate('/account/profile/connections')) }}>
                        <FormattedMessage
                            id="connections"
                            defaultMessage="Connections"
                        />
                    </a>
                </div>
                : null
            }
            {visible('/account/crew/') ?
                <div>
                    <a className={classes('/account/crew/public')} href="/account/crew/public" onClick={e => { dispatch(navigate('/account/crew/public')) }}>
                        <FormattedMessage
                            id="publicData"
                            defaultMessage="Public data"
                        />
                    </a>
                    <a className={classes('/account/crew/images')} href="/account/crew/images" onClick={e => { dispatch(navigate('/account/crew/images')) }}>
                        <FormattedMessage
                            id="images"
                            defaultMessage="Images"
                        />
                    </a>
                    <a className={classes('/account/crew/members')} href="/account/crew/members" onClick={e => { dispatch(navigate('/account/crew/members')) }}>
                        <FormattedMessage
                            id="members"
                            defaultMessage="Members"
                        />
                    </a>
                </div>
                : null
            }
            {visible('/account/performance/') ?
                <div>
                    <a className={classes('/account/performance/public')} href="/account/performance/public" onClick={e => { dispatch(navigate('/account/performance/public')) }}>
                        <FormattedMessage
                            id="publicData"
                            defaultMessage="Public data"
                        />
                    </a>
                    <a className={classes('/account/performance/images')} href="/account/performance/images" onClick={e => { dispatch(navigate('/account/performance/images')) }}>
                        <FormattedMessage
                            id="images"
                            defaultMessage="Images"
                        />
                    </a>
                    <a className={classes('/account/performance/events')} href="/account/performance/events" onClick={e => { dispatch(navigate('/account/performance/events')) }}>
                        <FormattedMessage
                            id="events"
                            defaultMessage="Events"
                        />
                    </a>
                    <a className={classes('/account/performance/authors')} href="/account/performance/authors" onClick={e => { dispatch(navigate('/account/performance/authors')) }}>
                        <FormattedMessage
                            id="authors"
                            defaultMessage="Authors"
                        />
                    </a>
                    <a className={classes('/account/performance/photogallery')} href="/account/performance/photogallery" onClick={e => { dispatch(navigate('/account/performance/photogallery')) }}>
                        <FormattedMessage
                            id="photogallery"
                            defaultMessage="Photo gallery"
                        />
                    </a>
                    <a className={classes('/account/performance/videogallery')} href="/account/performance/videogallery" onClick={e => { dispatch(navigate('/account/performance/videogallery')) }}>
                        <FormattedMessage
                            id="videogallery"
                            defaultMessage="Video gallery"
                        />
                    </a>
                    <a className={classes('/account/performance/settings')} href="/account/performance/settings" onClick={e => { dispatch(navigate('/account/performance/settings')) }}>
                        <FormattedMessage
                            id="settings"
                            defaultMessage="Settings"
                        />
                    </a>

                </div>
                : null
            }
            {visible('/account/event/') ?
                <div>
                    <a className={classes('/account/event/public')} href="/account/event/public" onClick={e => { dispatch(navigate('/account/event/public')) }}>
                        <FormattedMessage
                            id="publicData"
                            defaultMessage="Public data"
                        />
                    </a>
                    <a className={classes('/account/event/images')} href="/account/event/images" onClick={e => { dispatch(navigate('/account/event/images')) }}>
                        <FormattedMessage
                            id="images"
                            defaultMessage="Images"
                        />
                    </a>
                    <a className={classes('/account/event/performances')} href="/account/event/performances" onClick={e => { dispatch(navigate('/account/event/performances')) }}>
                        <FormattedMessage
                            id="performances"
                            defaultMessage="Performances"
                        />
                    </a>
                    <a className={classes('/account/event/partners')} href="/account/event/partners" onClick={e => { dispatch(navigate('/account/event/partners')) }}>
                        <FormattedMessage
                            id="partners"
                            defaultMessage="Partners"
                        />
                    </a>
                    <a className={classes('/account/event/photogallery')} href="/account/event/photogallery" onClick={e => { dispatch(navigate('/account/event/photogallery')) }}>
                        <FormattedMessage
                            id="photogallery"
                            defaultMessage="Photo gallery"
                        />
                    </a>
                    <a className={classes('/account/event/videogallery')} href="/account/event/videogallery" onClick={e => { dispatch(navigate('/account/event/videogallery')) }}>
                        <FormattedMessage
                            id="videogallery"
                            defaultMessage="Video gallery"
                        />
                    </a>
                    <a className={classes('/account/event/settings')} href="/account/event/settings" onClick={e => { dispatch(navigate('/account/event/settings')) }}>
                        <FormattedMessage
                            id="settings"
                            defaultMessage="Settings"
                        />
                    </a>

                </div>
                : null
            }

        </nav>
    );
};

const mapStateToProps = ({ user }) => ({
    user: user
});

export default connect(mapStateToProps)(SideNav);
