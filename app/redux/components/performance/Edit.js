import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Video from '../Video';
import ImageDropzone from '../ImageDropzone';
import About from '../about/About';
import Languages from '../language/Languages';
import Category from '../category/Category';
import Categories from '../category/Performance';

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
  removePerformancePerformer,

  removePerformanceCategory
  
} from '../../reducers/actions';

const Crew = injectIntl(({ crew, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {crew.name}
      </span>
      {crew.deletionInProgress ?
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

const Performer = injectIntl(({ performer, me, onDelete, intl }) => {
  const meLabel = intl.formatMessage({
    id: 'me',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${performer.stagename} `}
        {(performer._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      {performer.deletionInProgress ?
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

  const removeCategory = (categoryId) => (e) => {
    e.preventDefault();
    return dispatch(removePerformanceCategory(performance._id, categoryId));
  };

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
              id="title"
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



        <div className="row">
          <div className="col-md-9 form-group">
            <label htmlFor="about">
              <FormattedMessage
                id="addabout"
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
              <About about={a} />
            ))
          }
        </ul>

        <div className="form-group">
          <label htmlFor="teaserImage">
            <FormattedMessage
              id="teaserImage"
              defaultMessage="Teaser Image"
            />
          </label>
          {performance && performance.teaserImage ?
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
              id="image"
              defaultMessage="Image"
            />
          </label>
          {performance && performance.image ?
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

        <fieldset className="form-group">
        <legend>
          <FormattedMessage
            id="categories"
            defaultMessage="Categories"
          />
        </legend>

        <div className="row">
          <div className="col-md-9 form-group">
            <label htmlFor="category">
              <FormattedMessage
                id="addCategory"
                defaultMessage="Add category"
              />
            </label>
            {Categories ?
              <Field
                className="form-control custom-select"
                name="category"
                component="select"
                value={props.category}
              >
                <option value="performance">
                  <FormattedMessage
                    id="Please select"
                    defaultMessage="Please select"
                  />
                </option>
                {Categories.map((c) => (
                  <option value={c.key.toLowerCase()}>{c.name}</option>
                ))
                }
                { /*  */}
              </Field> :
              <p>Loading categories…</p>
            }
          </div>
        </div>

        <label>
          <FormattedMessage
            id="managecategories"
            defaultMessage="Manage your categories"
          />
        </label>
        <ul className="list-group mt-2">
          {
            performance && performance.categories && performance.categories.map((c) => (
              <Category
                category={c} 
                onDelete={removeCategory(c._id)}
              />
            ))
          }
        </ul>
      </fieldset>

        <div className="form-group">
          <label htmlFor="tech_art">
            <FormattedMessage
              id="tech_art"
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
              id="tech_req"
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
              id="performanceIsPublic"
              defaultMessage="Performance is public"
            />
          </label>
        </div>

        {performance && performance.video ?
          <Video {...performance.video.video} /> :
          <div className="form-group">
            <div className="input-group">
              <Field
                className="form-control"
                name="video"
                component="input"
                ref={node => { videoLink = node; }}
                placeholder={intl.formatMessage({
                  id: 'videolink.placeholder',
                  defaultMessage: 'https://vimeo.com/xyzxyzxyzxyz'
                })}
              />
              <span className="input-group-btn">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={e => {
                    e.preventDefault();
                    return dispatch(addPerformanceVideo({
                      _id: performance._id,
                      video: videoLink.value
                    }));
                  }}
                >
                  <FormattedMessage
                    id="addVideo"
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
              id="performers"
              defaultMessage="Performers"
            />
          </label>
          <ul className="list-group">
            {performance && performance.performers && performance.performers.map((performer) => (
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
              id="assignPerformers"
              defaultMessage="Assign performers"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'suggestPerformers',
              defaultMessage: 'Type to find performers…'
            })}
            onKeyUp={findPerformer}
          />
          <div className="mt-1 list-group">
            {performance && performance._performerSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="suggestPerformersLoading"
                  defaultMessage="Finding performers…"
                />
              </div> :
              null
            }
            {performerSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addPerformer(c.id)}
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
              id="crews"
              defaultMessage="Crews"
            />
          </label>
          <ul className="list-group">
            {performance && performance.crews && performance.crews.map((crew) => (
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
              id="assignCrews"
              defaultMessage="Assign crews"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'suggestCrews',
              defaultMessage: 'Type to find crews…'
            })}
            onKeyUp={findCrew}
          />
          <div className="mt-1 list-group">
            {performance && performance._crewSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="suggestCrewsLoading"
                  defaultMessage="Finding crews…"
                />
              </div> :
              null
            }
            {crewSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addCrew(c.id)}
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
              id="form.save"
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
    route('/admin/performances');
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
