import { h } from 'preact';
// import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import About from '../about/About';
import Languages from '../language/Languages';
import Layout from '../Layout';

const ProfileAboutsForm = ({
    user,
    intl,
    handleSubmit,
    userAboutEdit,
    userAboutDelete,
    saveProfile
    }) => {

  const onUserAboutEdit = (userId) => (about) => (e) => {
      about.is_primary = true;
      userAboutEdit(userId, about._id);
    };
  const onUserAboutDelete = (userId) => (about) => (e) => {
      console.log('onUserAboutDelete');
      userAboutDelete(userId, about._id);
    };
  return (
        <Layout>
            <form onSubmit={handleSubmit(saveProfile)}>

                <fieldset className="form-group">
                    <legend>
                        <FormattedMessage
                            id="abouts"
                            defaultMessage="About you..."
                        />
                    </legend>

                    <div className="row">
                        <div className="col-md-9 form-group">
                            <label htmlFor="about">
                                <FormattedMessage
                                    id="addabout"
                                    defaultMessage="About you"
                                />
                            </label>
                            <div className="input-group">
                                <Field
                                    className="form-control"
                                    name="about"
                                    component="textarea"
                                    rows="4"
                                    placeholder={intl.formatMessage({
                                      id: 'about.placeholder',
                                      defaultMessage: 'Tell me something about you.'
                                    })}
                                    value={user.about}
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
                                    value={user.aboutlanguage}
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
                    <label>
                        <FormattedMessage
                            id="manageabout"
                            defaultMessage="Manage your About texts"
                        />
                    </label>
                    <ul className="list-group mt-2">
                        {
                            user && user.abouts && user.abouts.map((a) => (
                                <About
                                    about={a}
                                    onEdit={onUserAboutEdit(user._id)(a)}
                                    onDelete={onUserAboutDelete(user._id)(a)}
                                    intl={intl}
                                />
                            ))
                        }
                    </ul>
                </fieldset>

            </form>
        </Layout >
    );
};

export default injectIntl(reduxForm({
  form: 'userabouts',
  enableReinitialize: true
})(ProfileAboutsForm));
