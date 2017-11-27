import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Link from '../link/Link';
import LinkType from '../link/LinkType';
import Layout from '../Layout';

const ProfileLinksForm = ({
    user,
    intl,
    handleSubmit,
    userLinkMakePrimary,
    userLinkMakePrivate,
    userLinkMakePublic,
    userLinkConfirm,
    userLinkDelete,
    saveProfile
    }) => {

    const onUserLinkMakePrimary = (userId) => (link) => (e) => {
        userLinkMakePrimary(userId, link._id);
    };
    const onUserLinkMakePrivate = (userId) => (link) => (e) => {
        userLinkMakePrivate(userId, link._id);
    };
    const onUserLinkMakePublic = (userId) => (link) => (e) => {
        userLinkMakePublic(userId, link._id);
    };
    const onUserLinkConfirm = (userId) => (link) => (e) => {
        userLinkConfirm(userId, link._id);
    };
    const onUserLinkDelete = (userId) => (link) => (e) => {
        userLinkDelete(userId, link._id);
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit(saveProfile)}>
                <fieldset className="form-group">
                    <legend>
                        <FormattedMessage
                            id="links"
                            defaultMessage="Links"
                        />
                    </legend>

                    <div className="row">
                        <div className="col-md-9 form-group">
                            <label htmlFor="link">
                                <FormattedMessage
                                    id="addlink"
                                    defaultMessage="Add link"
                                />
                            </label>
                            <div className="input-group">
                                <Field
                                    className="form-control"
                                    name="link"
                                    component="input"
                                    placeholder={intl.formatMessage({
                                        id: 'link.placeholder',
                                        defaultMessage: 'https://www...'
                                    })}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 form-group">
                            <label htmlFor="linkType">
                                <FormattedMessage
                                    id="linkType"
                                    defaultMessage="Link type"
                                />
                            </label>
                            {LinkType ?
                                <Field
                                    className="form-control custom-select"
                                    name="linkType"
                                    component="select"
                                    value={user.linkType}
                                >
                                    <option value="web">
                                        <FormattedMessage
                                            id="Please select"
                                            defaultMessage="Please select"
                                        />
                                    </option>
                                    {LinkType.map((c) => (
                                        <option value={c.key.toLowerCase()}>{c.name}</option>
                                    ))
                                    }
                                    { /*  */}
                                </Field> :
                                <p>Loading a link types…</p>
                            }
                        </div>
                    </div>

                    <label>
                        <FormattedMessage
                            id="link"
                            defaultMessage="Manage your links"
                        />
                    </label>
                    <ul className="list-group mt-2">
                        {
                            user && user.links && user.links.map((l) => (
                                <Link
                                    link={l}
                                    onMakePrimary={onUserLinkMakePrimary(user._id)(l)}
                                    onMakePrivate={onUserLinkMakePrivate(user._id)(l)}
                                    onMakePublic={onUserLinkMakePublic(user._id)(l)}
                                    onConfirm={onUserLinkConfirm(user._id)(l)}
                                    onDelete={onUserLinkDelete(user._id)(l)}
                                    intl={intl}
                                />
                            ))
                        }
                    </ul>
                </fieldset>


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
        </Layout >
    );
};

export default injectIntl(reduxForm({
    form: 'userLinks',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
})(ProfileLinksForm));
