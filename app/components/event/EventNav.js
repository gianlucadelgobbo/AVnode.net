import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const EventNav = ({ user, dispatch, url }) => {
    let id = url.substring(url.lastIndexOf('/') + 1);
    const classes = (path) => {
        // console.log('eNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
        return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
    }

    return (
        <div>
            <nav id="account-sidenav" class="nav-justified pull-left">
                <a className={classes('/account/event/public/'+id)} href={`/account/event/public/${id}`} onClick={e => { dispatch(navigate('/account/event/public/'+id)) }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/account/event/images/'+id)} href={`/account/event/images/${id}`} onClick={e => { dispatch(navigate('/account/event/images/'+id)) }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/account/event/performances/'+id)} href={`/account/event/performances/${id}`} onClick={e => { dispatch(navigate('/account/event/performances/'+id)); }}>
                <FormattedMessage
                    id="performances"
                    defaultMessage="Performances"
                />
            </a>
            <a className={classes('/account/event/partners/'+id)} href={`/account/event/partners/${id}`} onClick={e => { dispatch(navigate('/account/event/partners/'+id)); }}>
                <FormattedMessage
                    id="partners"
                    defaultMessage="Partners"
                />
            </a>
            <a className={classes('/account/event/photogallery/'+id)} href={`/account/event/photogallery/${id}`} onClick={e => { dispatch(navigate('/account/event/photogallery/'+id)); }}>
                <FormattedMessage
                    id="photogallery"
                    defaultMessage="Photo gallery"
                />
            </a>
            <a className={classes('/account/event/videogallery/'+id)} href={`/account/event/videogallery/${id}`} onClick={e => { dispatch(navigate('/account/event/videogallery/'+id)); }}>
                <FormattedMessage
                    id="videogallery"
                    defaultMessage="Video gallery"
                />
            </a>
            <a className={classes('/account/event/settings/'+id)} href={`/account/event/settings/${id}`} onClick={e => { dispatch(navigate('/account/event/settings/'+id)); }}>
                <FormattedMessage
                    id="settings"
                    defaultMessage="Settings"
                />
            </a>

            </nav>
        </div>
    );
};

const mapStateToProps = ({ user }) => ({
    user: user
});

export default connect(mapStateToProps)(EventNav);
