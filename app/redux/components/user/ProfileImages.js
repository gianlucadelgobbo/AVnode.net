import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ImageDropzone from '../ImageDropzone';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
import renderLabel from '../renderLabel';

const ProfileImagesForm = ({
    user,
    intl,
    handleSubmit,
    saveProfile,
    addUserProfileImage,
    addUserTeaserImage
    }) => {

    const onProfileImageDrop = (userId) => (files, _something, _ev) => {
        addUserProfileImage(userId, files[0]);
    };

    const onTeaserImageDrop = (userId) => (files, _something, _ev) => {
        addUserTeaserImage(userId, files[0]);
    };

    return (
        <div>
            <div className="container-fluid">
                <Match>
                    {({ url }) => <ProfileNav url={url} />}
                </Match>
            </div>
            <Layout>
                <form onSubmit={handleSubmit(saveProfile)}>
                    <fieldset className="form-group">
                        <Field
                            name="errorMessage"
                            component={renderLabel}
                        />
                        <legend>
                            <FormattedMessage
                                id="images"
                                defaultMessage="Images"
                            />
                        </legend>
                        <div className="form-group">
                            <label htmlFor="smallImage">
                                <FormattedMessage
                                    id="smallImage"
                                    defaultMessage="Small"
                                />
                            </label>
                            {user.imageFormats && user.imageFormats.small ?
                                <img
                                    className="img-thumbnail mb-3"
                                    src={`${user.imageFormats.small}`}
                                    alt={`image of ${user.stagename}`}
                                />
                                :
                                null
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="mediumImage">
                                <FormattedMessage
                                    id="mediumImage"
                                    defaultMessage="Medium"
                                />
                            </label>
                            {user.imageFormats && user.imageFormats.small ?
                                <img
                                    className="img-thumbnail mb-3"
                                    src={`${user.imageFormats.medium}`}
                                    alt={`image of ${user.stagename}`}
                                />
                                :
                                null
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="profileImage">
                                <FormattedMessage
                                    id="profileImage"
                                    defaultMessage="Large"
                                />
                            </label>
                            {user.imageFormats && user.imageFormats.large ?
                                <div>
                                    <img
                                        className="img-thumbnail mb-3"
                                        src={user.imageFormats.large}
                                        alt={`image of ${user.stagename}`}
                                    />
                                </div> :
                                null
                            }
                            <ImageDropzone
                                imageUploadInProgress={(user && user.imageUploadInProgress)}
                                onDrop={onProfileImageDrop(user._id)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">
                                <FormattedMessage
                                    id="teaserImage"
                                    defaultMessage="Teaser Image"
                                />
                            </label>
                            {user.teaserImageFormats && user.teaserImageFormats.large ?
                                <div>
                                    <img
                                        className="img-thumbnail mb-3"
                                        src={user.teaserImageFormats.large}
                                        alt={`image of ${user.stagename}`}
                                    />
                                </div> :
                                null
                            }
                            <ImageDropzone
                                imageUploadInProgress={(user && user.imageUploadInProgress)}
                                onDrop={onTeaserImageDrop(user._id)}
                            />
                        </div>
                    </fieldset>
                </form>
            </Layout >
        </div>
    );
};
export default injectIntl(reduxForm({
    form: 'userImages',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
})(ProfileImagesForm));
