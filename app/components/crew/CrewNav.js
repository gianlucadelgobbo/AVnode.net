import { h } from 'preact';
import { connect } from 'preact-redux';
import { crewNavigate } from '../../reducers/actions';
import { FormattedMessage } from 'preact-intl';

const CrewNav = ({ user, dispatch, url }) => {
  let id = url.substring(url.lastIndexOf('/') + 1);
  const classes = (path) => {
  // console.log('CNav--> user.active:' + user.active + ' id:' + id + ' url:' + url + '--> user.id:' + user.id + ' path:' + path + ' found:' + user.active.indexOf(path));
  return (url.indexOf(path) > -1) ? 'nav-link active' : 'nav-link';
};

  return (
<nav id="account-sidenav" className="nav-justified pull-left">
<a className={classes('/account/crew/public/'+id)} href={`/account/crew/public/${id}`} onClick={e => { dispatch(crewNavigate('/account/crew/public/'+id)); }}>
<FormattedMessage
    id="publicData"
    defaultMessage="Public data"
/>
</a>
<a className={classes('/account/crew/organization/'+id)} href={`/account/crew/organization/${id}`} onClick={e => { dispatch(crewNavigate('/account/crew/organization/'+id)); }}>
    <FormattedMessage
        id="organization"
        defaultMessage="Organization"
    />
</a>
<a className={classes('/account/crew/images/'+id)} href={`/account/crew/images/${id}`} onClick={e => { dispatch(crewNavigate('/account/crew/images/'+id)); }}>
    <FormattedMessage
        id="images"
        defaultMessage="Images"
    />
</a>
<a className={classes('/account/crew/members/'+id)} href={`/account/crew/members/${id}`} onClick={e => { dispatch(crewNavigate('/account/crew/members/'+id)); }}>
    <FormattedMessage
        id="members"
        defaultMessage="Members"
    />
</a>
</nav>
);
};

/* 20171221 const mapStateToProps = ({ user }) => ({
  user: user
});*/
const mapStateToProps = (state, props) => {
    console.log('_______________ props __________________________________');
    console.log('--> CrewNav props.url: ' + JSON.stringify(props.url));
    console.log('_______________ state __________________________________');
    console.log('--> CrewNav state.user.crewId: ' + JSON.stringify(state.user.crewId));
    return {
        crew: (state.user.crews.find(c => { return c._id === props._id; })),
        user: state.user
    };
};
export default connect(mapStateToProps)(CrewNav);
