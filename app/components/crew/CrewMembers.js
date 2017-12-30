import CrewNav from './CrewNav';
import Match from 'preact-router/match';

import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';

import {
  suggestCrewMember,
  addCrewMember,
  removeCrewMember
} from '../../reducers/actions';

const Member = injectIntl(({ member, me, onDelete, intl }) => {
  const meLabel = intl.formatMessage({
    id: 'Me',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      {member.file ?
        <img
          className="img-small mb-3"
          src={`${member.squareThumbnailUrl}`}
          alt={`image of ${member.stagename}`}
        />
        :
        null
      }
      <span>
        {`${member.stagename}`}
        {(member._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      {member.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

let CrewMembersForm = props => {
  const { handleSubmit, dispatch, crew, user } = props;
  const memberSuggestions = props.user._memberSuggestions || [];
  const findMember = (e) => {
    e.preventDefault();
    console.log('findMember, search:' + JSON.stringify(e.target.value));
    if (e.target.value.length > 2) {
      return dispatch(suggestCrewMember(crew._id, e.target.value));
    } // FIXME: handle reset
  };
  const addMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    console.log('addMember, crewId:' + crewId + ' member:' + JSON.stringify(member));
    return dispatch(addCrewMember(crewId, member));
  };

  const removeMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    console.log('removeMember, crewId:' + crewId + ' member:' + JSON.stringify(member));
    return dispatch(removeCrewMember(crewId, member));
  };

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <CrewNav url={url} />}
        </Match>
      </div>
      <Layout>
        <legend>
          <FormattedMessage
            id="crew"
            defaultMessage="Crew"
          />:
          &nbsp;{(props.crew) ? props.crew.stagename : null}
        </legend>
        <form onSubmit={handleSubmit}>
          <Field
            name="_id"
            component="input"
            type="hidden"
          />

          <div className="form-group">
            <label htmlFor="members">
              <FormattedMessage
                id="members"
                defaultMessage='Members'
              />
            </label>
            &nbsp;
                <span className="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='Public'
              />
            </span>
            <ul className="list-group">
              {crew && crew.members && crew.members.map((m) => (
                <Member
                  member={m}
                  me={props.user._id}
                  onDelete={removeMember(crew._id)(m)}
                />
              ))
              }
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="member">
              <FormattedMessage
                id="inviteMembers"
                defaultMessage="Invite members"
              />
            </label>
            <input
              className="form-control"
              type="text"
              autoComplete="off"
              placeholder={props.intl.formatMessage({
                id: 'assignMembers',
                defaultMessage: 'Type to find users…'
              })}
              onKeyUp={findMember}
            />
            <div className="mt-1 list-group">
              {user && user._memberSuggestionInProgress ?
                <div className="list-group-item">
                  <i className="fa fa-fw fa-spinner fa-pulse"></i>
                  {' '}
                  <FormattedMessage
                    id="suggestMembersLoading"
                    defaultMessage="Finding users…"
                  />
                </div> :
                null
              }
              {memberSuggestions.map((m) => (
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={addMember(props._id)(m)}
                >
                  {m.stagename} ({m.slug})
                      </button>
              ))
              }
            </div>
          </div>

          <div className="form-group">
            <button
              className="btn btn-primary"
              type="submit"
            >
              <FormattedMessage
                id="form.save"
                defaultMessage="Save"
              />
            </button>
          </div>
        </form>
      </Layout>
    </div>
  );
};

CrewMembersForm = injectIntl(reduxForm({ form: 'crewMembers' })(CrewMembersForm));

const CrewMembers = props => {
  const onSubmit = (props, dispatch) => {
    console.log('CrewPublic onSubmit');
    //dispatch(editCrew(props));
    //editCrew(dispatch);
  };
  const onSubmitSuccess = () => {
    console.log('CrewPublic onSubmitSuccess');
    //route('/account/crews');
  };
  return (
    <CrewMembersForm
      initialValues={props.crew}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  suggestCrewMember: dispatch(suggestCrewMember),
  addCrewMember: dispatch(addCrewMember),
  removeCrewMember: dispatch(removeCrewMember)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewMembers);