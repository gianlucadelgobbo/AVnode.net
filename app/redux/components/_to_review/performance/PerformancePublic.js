import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Video from '../Video';
import Abouts from '../about/Abouts';
import Category from '../category/Category';
import Categories from '../category/Performance';
import PerformanceNav from './PerformanceNav';
import Match from 'preact-router/match';
import {
    editPerformance,
    addPerformanceVideo,

    suggestPerformanceCrew,
    addPerformanceCrew,
    removePerformanceCrew,

    suggestPerformancePerformer,
    addPerformancePerformer,
    removePerformancePerformer,

    performanceAboutDelete,

    addPerformanceCategory,
    removePerformanceCategory

} from '../../reducers/actions';

const Crew = injectIntl(({ crew, onDelete }) => {
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
            {performer.file ?
                <img
                    className="img-small mb-3"
                    src={`${performer.imageUrl}`}
                    alt={`image of ${performance.stagename}`}
                />
                :
                null
            }
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

let PerformancePublicForm = props => {
    const { handleSubmit, dispatch, aboutDelete, removePerformanceCategory, performance, intl } = props;
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
    const onChange = ({ target: { value, name } }) => {
        if (value !== '') {
            console.log('PerformancePublicForm, onChange name:' + name);
            if (name === 'category') {
                console.log('PerformancePublicForm, onChange category value:' + value);
                dispatch(addPerformanceCategory(performance._id, value));
            }
        }
    };
    const removeCategory = (categoryId) => (e) => {
        e.preventDefault();
        removePerformanceCategory(performance._id, categoryId);
    };

    /*const onPerformanceAboutEdit = (about) => (e) => {
        return dispatch(performanceAboutEdit(performance._id, about.lang));
      };
  
    const onPerformanceAboutDelete = (about) => (e) => {
        return dispatch(performanceAboutDelete(performance._id, about.lang));
    };*/

    let videoLink; // FIXME

    return (
        <div>
            <div className="container-fluid">
                <Match>
                    {({ url }) => <PerformanceNav url={url} performance={props.performance} />}
                </Match>
            </div>
            <Layout>
                <form onSubmit={handleSubmit(editPerformance)} onChange={onChange}>
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
                    { /* abouts start */}
                    <FieldArray name="abouts" component={Abouts} />
                    { /* abouts end */}
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
                                            <option value={c.key}>{c.name}</option>
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
                                    {c.username} ({c.name})
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
        </div>
    );
};

PerformancePublicForm = injectIntl(reduxForm({ form: 'performancePublic' })(PerformancePublicForm));

const PerformancePublic = props => {
    console.log('PerformancePublic props');
    const onSubmit = (props, dispatch) => {
        console.log('PerformancePublic onSubmit');
        dispatch(editPerformance(props));
    };
    const onSubmitSuccess = () => {
        console.log('PerformancePublic onSubmitSuccess');
    };
    return (
        <PerformancePublicForm
            initialValues={props.performance}
            onSubmit={onSubmit}
            onSubmitSuccess={onSubmitSuccess}
            {...props}
        />
    );
};

const mapStateToProps = (state, props) => {
    return {
        performance: (state.user.performances.find(p => { return p._id === props._id; })),
        user: state.user
    };
};
const mapDispatchToProps = (dispatch) => ({
    addPerformanceCategory: dispatch(addPerformanceCategory),
    removePerformanceCategory: dispatch(removePerformanceCategory),
    aboutDelete: dispatch(performanceAboutDelete),
    editPerformance: dispatch(editPerformance)
});
export default connect(mapStateToProps, mapDispatchToProps)(PerformancePublic);

