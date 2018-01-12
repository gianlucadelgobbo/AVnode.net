import { h } from 'preact';
import { connect } from 'preact-redux';
import { eventNavigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';

const EventNav = ({ user, dispatch, url }) => {
  let id = url.substring(url.lastIndexOf('/') + 1);
  const classes = (path) => {
    // console.log('eNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
    //console.log('eNav--> dispatch:' + dispatch);
    return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
  };

  return (
        <div>
            <nav id="account-sidenav" className="nav-justified pull-left">
                <a className={classes('/admin/event/public/'+id)} href={`/admin/event/public/${id}`} onClick={e => {console.log('evt pub'+id); dispatch(eventNavigate('/admin/event/public/'+id)); }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/admin/event/images/'+id)} href={`/admin/event/images/${id}`} onClick={e => { dispatch(eventNavigate('/admin/event/images/'+id)); }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/admin/event/performances/'+id)} href={`/admin/event/performances/${id}`} onClick={e => { dispatch(eventNavigate('/admin/event/performances/'+id)); }}>
                <FormattedMessage
                    id="performances"
                    defaultMessage="Performances"
                />
            </a>
            <a className={classes('/admin/event/partners/'+id)} href={`/admin/event/partners/${id}`} onClick={e => { dispatch(eventNavigate('/admin/event/partners/'+id)); }}>
                <FormattedMessage
                    id="partners"
                    defaultMessage="Partners"
                />
            </a>
            <a className={classes('/admin/event/photogallery/'+id)} href={`/admin/event/photogallery/${id}`} onClick={e => { dispatch(eventNavigate('/admin/event/photogallery/'+id)); }}>
                <FormattedMessage
                    id="photogallery"
                    defaultMessage="Photo gallery"
                />
            </a>
            <a className={classes('/admin/event/videogallery/'+id)} href={`/admin/event/videogallery/${id}`} onClick={e => { dispatch(eventNavigate('/admin/event/videogallery/'+id)); }}>
                <FormattedMessage
                    id="videogallery"
                    defaultMessage="Video gallery"
                />
            </a>
            <a className={classes('/admin/event/settings/'+id)} href={`/admin/event/settings/${id}`} onClick={e => { dispatch(eventNavigate('/admin/event/settings/'+id)); }}>
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
