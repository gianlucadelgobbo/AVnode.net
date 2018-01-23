import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';
// import { route, Router, Route, Link } from 'preact-router';

const ProfileNav = ({ user, dispatch, url }) => {
  let id = url.substring(url.lastIndexOf('/') + 1);
  const classes = (path) => {
    //if (user.active.indexOf(path)==0) console.log('PrNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
    return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
  };

  return (
    <div>
      <nav id="account-sidenav" className="nav-justified pull-left">
        <a className={classes('/admin/profile/public')} href="/admin/profile/public" onClick={e => { dispatch(navigate('/admin/profile/public')); }}>
                    <FormattedMessage
                        id="publicData"
                        defaultMessage="Public data"
                    />
                </a>
                <a className={classes('/admin/profile/images')} href="/admin/profile/images" onClick={e => { dispatch(navigate('/admin/profile/images')); }}>
                    <FormattedMessage
                        id="images"
                        defaultMessage="Images"
                    />
                </a>
                <a className={classes('/admin/profile/emails')} href="/admin/profile/emails" onClick={e => { dispatch(navigate('/admin/profile/emails')); }}>
                    <FormattedMessage
                        id="emails"
                        defaultMessage="Emails"
                    />
                </a>
                <a className={classes('/admin/profile/private')} href="/admin/profile/private" onClick={e => { dispatch(navigate('/admin/profile/private')); }}>
                    <FormattedMessage
                        id="privateData"
                        defaultMessage="Private data"
                    />
                </a>
                <a className={classes('/admin/profile/password')} href="/admin/profile/password" onClick={e => { dispatch(navigate('/admin/profile/password')); }}>
                    <FormattedMessage
                        id="password"
                        defaultMessage="Password"
                    />
                </a>
                <a className={classes('/admin/profile/connections')} href="/admin/profile/connections" onClick={e => { dispatch(navigate('/admin/profile/connections')); }}>
                    <FormattedMessage
                        id="connections"
                        defaultMessage="Connections"
                    />
                </a>
            </nav>
        </div>
  );
};

const mapStateToProps = ({ user }) => ({
  user: user
});

export default connect(mapStateToProps)(ProfileNav);
