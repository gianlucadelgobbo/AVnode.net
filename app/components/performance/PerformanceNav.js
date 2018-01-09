import { h } from 'preact';
import { connect } from 'preact-redux';
import { performanceNavigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';

const PerformanceNav = ({ user, dispatch, url }) => {
  let id = url.substring(url.lastIndexOf('/') + 1);
  const classes = (path) => {
        // console.log('PeNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
    return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
  }

  return (
        <div>
            <nav id="account-sidenav" className="nav-justified pull-left">
                <a className={classes('/account/performance/public/'+id)} href={`/account/performance/public/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/public/'+id)); }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/account/performance/images/'+id)} href={`/account/performance/images/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/images/'+id)); }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/account/performance/events/'+id)} href={`/account/performance/events/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/events/'+id)); }}>
                    <FormattedMessage
                        id="events"
                        defaultMessage="Events"
                    />
                </a>
                <a className={classes('/account/performance/authors/'+id)} href={`/account/performance/authors/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/authors/'+id)); }}>
                    <FormattedMessage
                        id="authors"
                        defaultMessage="Authors"
                    />
                </a>
                <a className={classes('/account/performance/photogallery/'+id)} href={`/account/performance/photogallery/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/photogallery/'+id)); }}>
                    <FormattedMessage
                        id="photogallery"
                        defaultMessage="Photo gallery"
                    />
                </a>
                <a className={classes('/account/performance/videogallery/'+id)} href={`/account/performance/videogallery/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/videogallery/'+id)); }}>
                    <FormattedMessage
                        id="videogallery"
                        defaultMessage="Video gallery"
                    />
                </a>
                <a className={classes('/account/performance/settings/'+id)} href={`/account/performance/settings/${id}`} onClick={e => { dispatch(performanceNavigate('/account/performance/settings/'+id)); }}>
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

export default connect(mapStateToProps)(PerformanceNav);
