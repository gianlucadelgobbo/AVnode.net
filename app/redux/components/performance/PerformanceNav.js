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
                <a className={classes('/admin/performance/public/'+id)} href={`/admin/performance/public/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/public/'+id)); }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/admin/performance/images/'+id)} href={`/admin/performance/images/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/images/'+id)); }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/admin/performance/events/'+id)} href={`/admin/performance/events/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/events/'+id)); }}>
                    <FormattedMessage
                        id="events"
                        defaultMessage="Events"
                    />
                </a>
                <a className={classes('/admin/performance/authors/'+id)} href={`/admin/performance/authors/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/authors/'+id)); }}>
                    <FormattedMessage
                        id="authors"
                        defaultMessage="Authors"
                    />
                </a>
                <a className={classes('/admin/performance/photogallery/'+id)} href={`/admin/performance/photogallery/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/photogallery/'+id)); }}>
                    <FormattedMessage
                        id="photogallery"
                        defaultMessage="Photo gallery"
                    />
                </a>
                <a className={classes('/admin/performance/videogallery/'+id)} href={`/admin/performance/videogallery/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/videogallery/'+id)); }}>
                    <FormattedMessage
                        id="videogallery"
                        defaultMessage="Video gallery"
                    />
                </a>
                <a className={classes('/admin/performance/settings/'+id)} href={`/admin/performance/settings/${id}`} onClick={e => { dispatch(performanceNavigate('/admin/performance/settings/'+id)); }}>
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
