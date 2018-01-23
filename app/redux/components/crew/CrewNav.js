import { h } from 'preact';
import { connect } from 'preact-redux';
import { crewNavigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';

const CrewNav = ({ user, dispatch, url }) => {
  let id = url.substring(url.lastIndexOf('/') + 1);
  const classes = (path) => {
  //console.log('CNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
    return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
  };

  return (
<nav id="account-sidenav" className="nav-justified pull-left">
<a className={classes('/admin/crew/public/'+id)} href={`/admin/crew/public/${id}`} onClick={e => { dispatch(crewNavigate('/admin/crew/public/'+id)); }}>
<FormattedMessage
    id="publicData"
    defaultMessage="Public data"
/>
</a>
<a className={classes('/admin/crew/organization/'+id)} href={`/admin/crew/organization/${id}`} onClick={e => { dispatch(crewNavigate('/admin/crew/organization/'+id)); }}>
    <FormattedMessage
        id="organization"
        defaultMessage="Organization"
    />
</a>
<a className={classes('/admin/crew/images/'+id)} href={`/admin/crew/images/${id}`} onClick={e => { dispatch(crewNavigate('/admin/crew/images/'+id)); }}>
    <FormattedMessage
        id="images"
        defaultMessage="Images"
    />
</a>
<a className={classes('/admin/crew/members/'+id)} href={`/admin/crew/members/${id}`} onClick={e => { dispatch(crewNavigate('/admin/crew/members/'+id)); }}>
    <FormattedMessage
        id="members"
        defaultMessage="Members"
    />
</a>
</nav>
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
export default connect(mapStateToProps)(CrewNav);
