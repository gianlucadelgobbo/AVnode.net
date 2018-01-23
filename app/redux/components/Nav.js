import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const Nav = ({ user, dispatch }) => {
  const classes = (path) => {
    // if (user.active.indexOf( path ) > -1) console.log('NAV--> user.active:'+user.active +' path:'+path +' found:'+user.active.indexOf(path));    
    return (user.active.indexOf( path ) > -1) ? 'nav-link active' : 'nav-link';
  }

  return (
    <nav id="account-nav" className="nav nav-pills nav-justified">
      <a className={classes('/admin/profile')} href="/admin/profile/public" onClick={e => { dispatch(navigate('/admin/profile/public')) }}>
        <FormattedMessage
          id="profile"
          defaultMessage="Profile"
        />
      </a>
      <a className={classes('/admin/crew')} href="/admin/crews" onClick={e => { dispatch(navigate('/admin/crews')) }}>
        <FormattedMessage
          id="crews"
          defaultMessage="Crews"
        /> <span className="badge badge-pill badge-default">{user.crews.length}</span>
      </a>
      <a className={classes('/admin/performance')} href="/admin/performances" onClick={e => { dispatch(navigate('/admin/performances')) }}>
        <FormattedMessage
          id="performances"
          defaultMessage="Performances"
        /> <span className="badge badge-pill badge-default">{user.performances.length}</span>
      </a>
      <a className={classes('/admin/event')} href="/admin/events" onClick={e => { dispatch(navigate('/admin/events')) }}>
        <FormattedMessage
          id="events"
          defaultMessage="Events"
        /> <span className="badge badge-pill badge-default">{user.events.length}</span>
      </a>
      <a className={classes('/admin/preferences')} href="/admin/preferences" onClick={e => { dispatch(navigate('/admin/preferences')) }}>
        <FormattedMessage
          id="preferences"
          defaultMessage="Preferences"
        />
      </a>
    </nav>
  );
};

const mapStateToProps = ({ user }) => ({
  user: user
});

export default connect(mapStateToProps)(Nav);
