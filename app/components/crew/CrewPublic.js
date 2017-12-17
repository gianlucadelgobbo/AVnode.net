import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Abouts from '../about/Abouts';
// import Languages from '../language/Languages';

import CrewNav from './CrewNav';
import Match from 'preact-router/match';
import {
    editCrew,
    crewAboutDelete
} from '../../reducers/actions';

let CrewForm = props => {
  const { handleSubmit, aboutDelete, crew, intl } = props;

    /*const onCrewAboutDelete = (crewId) => (about) => (e) => {
        return dispatch(crewAboutDelete(crewId, about.lang));
    };*/

  if (!props.org) props.org = {};

  return (
        <div>
            <div className="container-fluid">
                <Match>
                    {({ url }) => <CrewNav url={url} crew={props.crew} />}
                </Match>
            </div>
            <Layout>
                <form onSubmit={handleSubmit}>
                    <Field
                        name="_id"
                        component="input"
                        type="hidden"
                    />

                    <div className="form-group">
                        <label htmlFor="stagename">
                            <FormattedMessage
                                id="stagename"
                                defaultMessage="Name"
                            />
                        </label>
                        &nbsp;
            <span class="badge badge-success">
                            <FormattedMessage
                                id="public"
                                defaultMessage='Public'
                            />
                        </span>
                        <Field
                            className="form-control form-control-lg"
                            name="stagename"
                            component="input"
                            type="text"
                            value={props.stagename}
                        />
                    </div>
                    <p>( 
                      <FormattedMessage
                        id="username"
                        defaultMessage="Username"
                       /> : {props.username} slug : {props.slug})
                    </p>
                    <Abouts
                        current={crew}
                        intl={intl}
                        aboutDelete={aboutDelete}
                    />
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

CrewForm = injectIntl(reduxForm({ form: 'crewPublic' })(CrewForm));

const CrewPublic = props => {
  console.log('CrewPublic props');
  const onSubmit = (props, dispatch) => {
    console.log('CrewPublic onSubmit');
    dispatch(editCrew(props));
  };
  const onSubmitSuccess = () => {
    console.log('CrewPublic onSubmitSuccess');
        //route('/account/crews');
  };
  return (
        <CrewForm
            initialValues={props.crew}
            onSubmit={onSubmit}
            onSubmitSuccess={onSubmitSuccess}
            {...props}
        />
  );
};

const mapStateToProps = (state, props) => {
  console.log('_______________ props __________________________________');
  console.log('--> CrewPublic props.url: ' + JSON.stringify(props.url));
  console.log('_______________ state __________________________________');
  console.log('--> CrewPublic state.user.crewId: ' + JSON.stringify(state.user.crewId));
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  aboutDelete: dispatch(crewAboutDelete)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewPublic);

