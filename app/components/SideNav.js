import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const SideNav = ({ user, dispatch }) => {
  // console.log( JSON.stringify(user.active) );
  const classes = (path) => {
    // console.log( user.active.indexOf( path ) );   
    return (user.active === path) ? 'nav-link active' : 'nav-link'
  }
  return (
    <nav id="account-nav" class="nav-pills nav-justified pull-left">
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
      <a className={classes('/account/profile/links')} href="/account/profile/links" onClick={e => { dispatch(navigate('/account/profile/links')) }}>
        <FormattedMessage
          id="links"
          defaultMessage="Links"
        />
      </a>
      <a className={classes('/account/profile/emails')} href="/account/profile/emails" onClick={e => { dispatch(navigate('/account/profile/emails')) }}>
        <FormattedMessage
          id="emails"
          defaultMessage="Emails"
        />
      </a>
      <a className={classes('/account/profile/addresses')} href="/account/profile/addresses" onClick={e => { dispatch(navigate('/account/profile/addresses')) }}>
        <FormattedMessage
          id="addresses"
          defaultMessage="Addresses"
        />
      </a>
    </nav>
  );
};

const mapStateToProps = ({ user }) => ({
  user: user
});

export default connect(mapStateToProps)(SideNav);
