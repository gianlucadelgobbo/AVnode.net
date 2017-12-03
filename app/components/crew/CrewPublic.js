import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import About from '../about/About';
import Languages from '../language/Languages';

import CrewNav from './CrewNav';
import Match from 'preact-router/match';
import {
    editCrew,
    crewAboutEdit,
    crewAboutDelete,
    crewLinkDelete,
    crewLinkEdit
} from '../../reducers/actions';

let CrewForm = props => {
    const { handleSubmit, dispatch, crew, user, intl } = props;

    const onCrewAboutEdit = (crewId) => (about) => (e) => {
        return dispatch(crewAboutEdit(crewId, about.lang));
    };
    const onCrewAboutDelete = (crewId) => (about) => (e) => {
        return dispatch(crewAboutDelete(crewId, about.lang));
    };
    const onLinkEdit = (link) => (e) => {
        e.preventDefault();
        return crewLinkEdit(props._id, link._id);
    };
    const onLinkDelete = (link) => (e) => {
        e.preventDefault();
        return crewLinkDelete(props._id, link._id);
    };

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
                        <label htmlFor="name">
                            <FormattedMessage
                                id="name"
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
                            name="name"
                            component="input"
                            type="text"
                            value={props.name}
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
                            &nbsp;
              <span class="badge badge-success">
                                <FormattedMessage
                                    id="public"
                                    defaultMessage='Public'
                                />
                            </span>
                            <div className="input-group">
                                <Field
                                    className="form-control"
                                    name="about"
                                    component="textarea"
                                    rows="4"
                                    placeholder="About the crew"
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
                            crew && crew.abouts && crew.abouts.map((a) => (
                                <About
                                    about={a}
                                    onEdit={onCrewAboutEdit(crew._id)(a)}
                                    onDelete={onCrewAboutDelete(crew._id)(a)}
                                    intl={intl}
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
        </div>
    );
};

CrewForm = injectIntl(reduxForm({ form: 'crewPublic' })(CrewForm));

const CrewPublic = props => {
    const onSubmit = (props, dispatch) => {
        dispatch(editCrew(props));
    };
    const onSubmitSuccess = () => {
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
    console.log('--> CrewPublic mapStateToProps: ' + JSON.stringify(props));
    console.log('_______________ state __________________________________');
    console.log('--> CrewPublic mapStateToProps: ' + JSON.stringify(state));
    return {
        crew: (state.user.crews.find(c => { return c._id === props._id; })),
        user: state.user,
    };
};

export default connect(mapStateToProps)(CrewPublic);

