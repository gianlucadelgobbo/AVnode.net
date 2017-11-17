import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const PerformanceNav = ({ user, dispatch }) => {
    const classes = (path) => {
        return (user.active === path) ? 'nav-link active' : 'nav-link'
    }
    const visible = (path) => {
        if (user.active.indexOf(path) > -1) {
            console.log('--> performance'+ JSON.stringify(performance));       
            //console.log('--> user'+ JSON.stringify(user));
            console.log('--> user.active:'+user.active +'--> user.id:'+user.id +' path:'+path +' found:'+user.active.indexOf(path));
        }
        return (user.active.indexOf(path) > -1)
    }
    return (
        <nav id="account-sidenav" class="nav-justified pull-left">
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


        </nav>
    );
};

const mapStateToProps = ({ user, performance }) => ({
    user: user,
    performance: performance
});

export default connect(mapStateToProps)(PerformanceNav);
