import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Languages from '../language/Languages';

import {
  editPerformanceAbouts
} from '../../reducers/actions';


const About = injectIntl(({ about, me, onMakePrimary, intl }) => {
  const meLabel = intl.formatMessage({
    id: 'me',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      {about.lang} : {about.abouttext}
      {about.is_primary ?
        <span className="badge badge-primary">
          <FormattedMessage
            id="primary"
            defaultMessage="Primary"
          />
        </span> :
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onMakePrimary}
        >
          <i className="fa fa-star"></i>
          <FormattedMessage
            id="makeitprimary"
            defaultMessage="Make it primary"
          />
        </button>
      }
    </li>
  );
});

let PerformanceForm = props => {
  const { handleSubmit, dispatch, performance, user, intl } = props;

  const addPerformanceAbout = (performerId) => (e) => {
    e.preventDefault();
    return dispatch(addPerformanceAbout(performance._id, performerId));
  };

  const onAboutMakePrimary = (userId) => (aboutId) => (e) => {
    e.preventDefault();
    return dispatch(onPerformanceAboutMakePrimary(userId, performance._id, aboutId));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Field
          name="_id"
          component="input"
          type="hidden"
        />

        <div className="form-group">
          <label>
            {props.title}
          </label>
        </div>

        <div className="row">
          <div className="col-md-9 form-group">
            <label htmlFor="about">
              <FormattedMessage
                id="addAbout"
                defaultMessage="About"
              />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="about"
                component="textarea"
                rows="4"
                placeholder="About the performance"
                value={props.about}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <label htmlFor="aboutlanguage">
              <FormattedMessage
                id="language"
                defaultMessage="Language"
              />
            </label>
            {Languages ?
              <Field
                className="form-control custom-select"
                name="aboutlanguage"
                component="select"
                value={props.aboutlanguage}
              >
                <option value="en">
                  <FormattedMessage
                    id="language.en"
                    defaultMessage="English"
                  />
                </option>
                {Languages.map((c) => (
                  <option value={c.code}>{c.language}</option>
                ))
                }
                { /*  */}
              </Field> :
              <p>Loading languages…</p>
            }
          </div>
        </div>

        <label>
          <FormattedMessage
            id="manageabout"
            defaultMessage="Manage your About texts"
          />
        </label>
        <ul className="list-group mt-2">
          {
            performance && performance.abouts && performance.abouts.map((a) => (
              <About
                about={a}
                me={props.user._id}
                onMakePrimary={onAboutMakePrimary(performance.id)}
              />
            ))
          }
        </ul>

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
  );
};

PerformanceForm = injectIntl(reduxForm({ form: 'performanceAbouts' })(PerformanceForm));

const EditPerformanceAbouts = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editPerformanceAbouts(props));
  };
  const onSubmitSuccess = () => {
    //route('/admin/performances');
  };
  return (
    <PerformanceForm
      initialValues={props.performance}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    performance: (state.user.performances.find(c => { return c._id === props._id; })),
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditPerformanceAbouts);
