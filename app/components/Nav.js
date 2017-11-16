import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const Nav = ({ user, dispatch }) => {
  const classes = (path) => {
    return (user.active.indexOf( path ) > -1) ? 'nav-link active' : 'nav-link'
  }
  return (
    <nav id="account-sidenav" class="nav nav-pills nav-justified">
      <a className={classes('/account/profile')} href="/account/profile" onClick={e => { dispatch(navigate('/account/profile')) }}>
        <FormattedMessage
          id="profile"
          defaultMessage="Profile"
        />
      </a>
      <a className={classes('/account/crews')} href="/account/crews" onClick={e => { dispatch(navigate('/account/crews')) }}>
        <FormattedMessage
          id="Crews"
          defaultMessage="Crews"
        /> <span class="badge badge-pill badge-default">{user.crews.length}</span>
      </a>
      <a className={classes('/account/performances')} href="/account/performances" onClick={e => { dispatch(navigate('/account/performances')) }}>
        <FormattedMessage
          id="Performances"
          defaultMessage="Performances"
        /> <span class="badge badge-pill badge-default">{user.performances.length}</span>
      </a>
      <a className={classes('/account/events')} href="/account/events" onClick={e => { dispatch(navigate('/account/events')) }}>
        <FormattedMessage
          id="Events"
          defaultMessage="Events"
        /> <span class="badge badge-pill badge-default">{user.events.length}</span>
      </a>
      <a className={classes('/account/preferences')} href="/account/preferences" onClick={e => { dispatch(navigate('/account/preferences')) }}>
        <FormattedMessage
          id="Preferences"
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
