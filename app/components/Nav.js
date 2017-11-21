import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const Nav = ({ user, dispatch }) => {
  const classes = (path) => {
    if (user.active.indexOf( path ) > -1) console.log('NAV--> user.active:'+user.active +' path:'+path +' found:'+user.active.indexOf(path));    
    return (user.active.indexOf( path ) > -1) ? 'nav-link active' : 'nav-link'
  }

  return (
    <nav id="account-nav" class="nav nav-pills nav-justified">
      <a className={classes('/account/profile')} href="/account/profile/public" onClick={e => { dispatch(navigate('/account/profile/public')) }}>
        <FormattedMessage
          id="profile"
          defaultMessage="Profile"
        />
      </a>
      <a className={classes('/account/crew')} href="/account/crews" onClick={e => { dispatch(navigate('/account/crews')) }}>
        <FormattedMessage
          id="crews"
          defaultMessage="Crews"
        /> <span class="badge badge-pill badge-default">{user.crews.length}</span>
      </a>
      <a className={classes('/account/performance')} href="/account/performances" onClick={e => { dispatch(navigate('/account/performances')) }}>
        <FormattedMessage
          id="performances"
          defaultMessage="Performances"
        /> <span class="badge badge-pill badge-default">{user.performances.length}</span>
      </a>
      <a className={classes('/account/event')} href="/account/events" onClick={e => { dispatch(navigate('/account/events')) }}>
        <FormattedMessage
          id="events"
          defaultMessage="Events"
        /> <span class="badge badge-pill badge-default">{user.events.length}</span>
      </a>
      <a className={classes('/account/preferences')} href="/account/preferences" onClick={e => { dispatch(navigate('/account/preferences')) }}>
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
