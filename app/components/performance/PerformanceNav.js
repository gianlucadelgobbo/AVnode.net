import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const PerformanceNav = ({ user, dispatch, url }) => {
    let id = url.substring(url.lastIndexOf('/') + 1);
    const classes = (path) => {
        console.log('PeNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
        if (url.indexOf(path) > -1) {
            console.log('PNav--> perf' + JSON.stringify(performance));
        }
        return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link'
    }

    return (
        <div>
            <pre>PerformanceNav:{user.active} URL:{url}</pre>
            <nav id="account-sidenav" class="nav-justified pull-left">
                <a className={classes('/account/performance/public/'+id)} href={`/account/performance/public/${id}`} onClick={e => { dispatch(navigate('/account/performance/public/'+id)) }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/account/performance/images/'+id)} href={`/account/performance/images/${id}`} onClick={e => { dispatch(navigate('/account/performance/images/'+id)) }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/account/performance/events')} href={`/account/performance/events/${id}`} onClick={e => { dispatch(navigate('/account/performance/events')) }}>
                    <FormattedMessage
                        id="events"
                        defaultMessage="Events"
                    />
                </a>
                <a className={classes('/account/performance/authors')} href={`/account/performance/authors/${id}`} onClick={e => { dispatch(navigate('/account/performance/authors')) }}>
                    <FormattedMessage
                        id="authors"
                        defaultMessage="Authors"
                    />
                </a>
                <a className={classes('/account/performance/photogallery')} href={`/account/performance/photogallery/${id}`} onClick={e => { dispatch(navigate('/account/performance/photogallery')) }}>
                    <FormattedMessage
                        id="photogallery"
                        defaultMessage="Photo gallery"
                    />
                </a>
                <a className={classes('/account/performance/videogallery')} href={`/account/performance/videogallery/${id}`} onClick={e => { dispatch(navigate('/account/performance/videogallery')) }}>
                    <FormattedMessage
                        id="videogallery"
                        defaultMessage="Video gallery"
                    />
                </a>
                <a className={classes('/account/performance/settings')} href={`/account/performance/settings/${id}`} onClick={e => { dispatch(navigate('/account/performance/settings')) }}>
                    <FormattedMessage
                        id="settings"
                        defaultMessage="Settings"
                    />
                </a>
            </nav>
        </div>
    );
};

const mapStateToProps = ({ user, performance }) => ({
    user: user,
    performance: performance
});

export default connect(mapStateToProps)(PerformanceNav);
