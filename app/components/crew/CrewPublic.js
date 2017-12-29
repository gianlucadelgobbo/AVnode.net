import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Abouts from '../about/Abouts';
// import Languages from '../language/Languages';

import CrewNav from './CrewNav';
import Match from 'preact-router/match';
import {
    editCrew
} from '../../reducers/actions';

let CrewForm = props => {
  const { handleSubmit, editCrew, crew, intl } = props;

  // if (!props.org) props.org = {};

  return (
        <div>
            <div className="container-fluid">
                <Match>
                    {({ url }) => <CrewNav url={url} crew={props.crew} />}
                </Match>
            </div>
            <Layout>
                <form onSubmit={handleSubmit(editCrew)}>
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
                        <span className="badge badge-success">
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
                        />
                    </div>
                    { /* <p>(
                      <FormattedMessage
                            id="username"
                            defaultMessage="Username"
                        /> : {props.crew.username} slug : {props.crew.slug})
                    </p> */}
                    { /* abouts start */}
                    <FieldArray name="abouts" component={Abouts} />
                    { /* abouts end */}
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
  console.log('--> CrewPublic props.slug: ' + JSON.stringify(props.slug));
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  editCrew: dispatch(editCrew)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewPublic);

