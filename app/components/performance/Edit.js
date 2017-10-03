import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Video from '../Video';

import {
  editPerformance,
  addPerformanceImage,
  addPerformanceTeaserImage,
  addPerformanceVideo,
  suggestPerformanceCrew,
  addPerformanceCrew,
  removePerformanceCrew,
  suggestPerformancePerformer,
  addPerformancePerformer,
  removePerformancePerformer
} from '../../reducers/actions';
import ImageDropzone from '../ImageDropzone';
import About from '../about/About';

const allLanguages = require('language-list')();

const Crew = injectIntl(({crew, onDelete, intl}) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>
      {crew.name}
      </span>
      { crew.deletionInProgress ?
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

const Performer = injectIntl(({performer, me, onDelete, intl}) => {
  const meLabel = intl.formatMessage({
    id: 'performance.edit.form.performer.met',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${performer.stagename} `}
        { (performer._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      { performer.deletionInProgress ?
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

let PerformanceForm = props => {
  const { handleSubmit, dispatch, performance, user, intl } = props;
  const crewSuggestions = props.user._crewSuggestions || [];

  const findCrew = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestPerformanceCrew(performance._id, e.target.value));
    } // FIXME: handle reset
  };

  const addCrew = (crewId) => (e) => {
    e.preventDefault();
    return dispatch(addPerformanceCrew(performance._id, crewId));
  };

  const removeCrew = (crewId) => (e) => {
    e.preventDefault();
    return dispatch(removePerformanceCrew(performance._id, crewId));
  };

  const performerSuggestions = props.user._performerSuggestions || [];

  const findPerformer = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestPerformancePerformer(performance._id, e.target.value));
    } // FIXME: handle reset
  };

  const addPerformer = (performerId) => (e) => {
    e.preventDefault();
    return dispatch(addPerformancePerformer(performance._id, performerId));
  };

  const removePerformer = (performerId) => (e) => {
    e.preventDefault();
    return dispatch(removePerformancePerformer(performance._id, performerId));
  };

  const onImageDrop = (performanceId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addPerformanceImage(performanceId, file));
  };

  const onTeaserImageDrop = (performanceId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addPerformanceTeaserImage(performanceId, file));
  };

  if (!props._languages) {
    console.log('TODO optimize load props._languages from user' )
    props._languages = props.user._languages || allLanguages.getData();
  } else {
    console.log('props._languages already loaded!' )
  }

  let videoLink; // FIXME

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Field
          name="_id"
          component="input"
          type="hidden"
        />

        <div className="form-group">
          <label htmlFor="title">
            <FormattedMessage
              id="performance.edit.form.label.title"
              defaultMessage="Name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="title"
            component="input"
            type="text"
            value={props.title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="teaserImage">
            <FormattedMessage
              id="performance.edit.form.label.teaserimage"
              defaultMessage="Teaser Image"
            />
          </label>
          { performance && performance.teaserImage ?
            <img
              className="img-thumbnail mb-3"
              src={performance.teaserImage.publicUrl}
              alt={`image of ${performance.title}`}
              /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(performance && performance.imageUploadInProgress)}
            onDrop={onTeaserImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">
            <FormattedMessage
              id="performance.edit.form.label.image"
              defaultMessage="Image"
            />
          </label>
          { performance && performance.image ?
            <img
              className="img-thumbnail mb-3"
              src={performance.image.publicUrl}
              alt={`image of ${performance.title}`}
              /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(performance && performance.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>


            <div className="row">
              <div className="col-md-9 form-group">
                <label htmlFor="about">
                  <FormattedMessage
                    id="performance.edit.form.label.addabout"
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
                    id="performance.edit.form.label.aboutlanguage"
                    defaultMessage="Language"
                  />
                </label>
                {props._languages ?
                  <Field
                    className="form-control custom-select"
                    name="aboutlanguage"
                    component="select"
                    value={props.aboutlanguage}
                  >
                    <option value="en">
                      <FormattedMessage
                        id="performance.edit.form.label.aboutlanguage.empty"
                        defaultMessage="English"
                      />
                    </option>
                    {props._languages.map((c) => (
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
                id="performance.edit.form.label.about"
                defaultMessage="Manage your About texts"
              />
            </label>
            <ul className="list-group mt-2">
              {
                performance && performance.abouts && performance.abouts.map((a) => (
                  <About about={a} />
                ))
              }
            </ul>

      
      <div className="form-group">
          <label htmlFor="tech_art">
            <FormattedMessage
              id="performance.edit.form.label.tech_art"
              defaultMessage="Artist hardware"
            />
          </label>
          <Field
            className="form-control"
            name="tech_art"
            component="textarea"
            value={props.tech_art}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tech_req">
            <FormattedMessage
              id="performance.edit.form.label.tech_req"
              defaultMessage="Technical Support (what you need)"
            />
          </label>
          <Field
            className="form-control"
            name="tech_req"
            component="textarea"
            value={props.tech_req}
          />
        </div>

        <div className="form-check">
          <label className="form-check-label">
            <Field
              className="form-check-input form-control-lg"
              name="is_public"
              component="input"
              type="checkbox"
              value={props.is_public}
            />
            <FormattedMessage
              id="performance.edit.form.label.is_public"
              defaultMessage="Performance is public"
            />
          </label>
        </div>

        { performance && performance.video ?
          <Video {...performance.video.video} /> :
          <div className="form-group">
            <div className="input-group">
              <Field
                className="form-control"
                name="video"
                component="input"
                ref={ node => { videoLink = node; }}
                placeholder={intl.formatMessage({
                  id: 'performance.edit.form.label.videoLink.placeholder',
                  defaultMessage: 'https://vimeo.com/xyzxyzxyzxyz'
                })}
              />
              <span className="input-group-btn">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={ e => {
                    e.preventDefault();
                    return dispatch(addPerformanceVideo({
                      _id: performance._id,
                      video: videoLink.value
                    }));
                  }}
                >
                  <FormattedMessage
                    id="performance.edit.form.label.videoLink.action"
                    defaultMessage="Add video"
                  />
                </button>
              </span>
            </div>
          </div>
        }

        <div className="form-group">
          <label htmlFor="performers">
            <FormattedMessage
              id="performance.edit.form.label.performers"
              defaultMessage="Performers"
            />
          </label>
          <ul className="list-group">
            { performance && performance.performers && performance.performers.map((performer) => (
              <Performer
                performer={performer}
                me={props.user._id}
                onDelete={removePerformer(performer.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="performer">
            <FormattedMessage
              id="performance.edit.form.label.suggestPerformers"
              defaultMessage="Assign performers"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'performance.edit.form.label.suggestPerformers',
              defaultMessage: 'Type to find performers…'
            })}
            onKeyUp={ findPerformer }
          />
          <div className="mt-1 list-group">
            { performance && performance._performerSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="performer.edit.form.label.suggestPerformersLoading"
                  defaultMessage="Finding performers…"
                />
              </div> :
              null
            }
            { performerSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addPerformer(c.id) }
              >
                  {c.stagename} ({c.name})
                </button>
              ))
            }
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="crews">
            <FormattedMessage
              id="performance.edit.form.label.crews"
              defaultMessage="Crews"
            />
          </label>
          <ul className="list-group">
            { performance && performance.crews && performance.crews.map((crew) => (
              <Crew
                crew={crew}
                onDelete={removeCrew(crew.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="crew">
            <FormattedMessage
              id="performance.edit.form.label.suggestCrews"
              defaultMessage="Assign crews"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'performance.edit.form.label.suggestCrews',
              defaultMessage: 'Type to find crews…'
            })}
            onKeyUp={ findCrew }
          />
          <div className="mt-1 list-group">
            { performance && performance._crewSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="crew.edit.form.label.suggestCrewsLoading"
                  defaultMessage="Finding crews…"
                />
              </div> :
              null
            }
            { crewSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addCrew(c.id) }
              >
                  {c.name}
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
              id="general.form.save"
              defaultMessage="Save"
            />
          </button>
        </div>
      </form>
    </Layout>
  );
};

PerformanceForm = injectIntl(reduxForm({ form: 'performance' })(PerformanceForm));

const EditPerformance = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editPerformance(props));
  };
  const onSubmitSuccess = () => {
    route('/account/performances');
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

export default connect(mapStateToProps)(EditPerformance);
