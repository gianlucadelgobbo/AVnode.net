import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ImageDropzone from '../ImageDropzone';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';

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
                        <legend>
                            <FormattedMessage
                                id="images"
                                defaultMessage="Images"
                            />
                        </legend>

                        <div className="form-group">
                            <label htmlFor="profileImage">
                                <FormattedMessage
                                    id="profileImage"
                                    defaultMessage="Profile Image"
                                />
                            </label>
                            {user && user.image ?
                                <div>
                                    <img
                                        className="img-thumbnail mb-3"
                                        src={user.image.publicUrl}
                                        alt={`image of ${user.username}`}
                                    />
                                </div> :
                                null
                            }
                            <ImageDropzone
                                imageUploadInProgress={(user && user.profileImageUploadInProgress)}
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
                            {user && user.teaserImage ?
                                <div>
                                    <img
                                        className="img-thumbnail mb-3"
                                        src={user.teaserImage.publicUrl}
                                        alt={`image of ${user.username}`}
                                    />
                                </div> :
                                null
                            }
                            <ImageDropzone
                                imageUploadInProgress={(user && user.teaserImageUploadInProgress)}
                                onDrop={onTeaserImageDrop(user._id)}
                            />
                        </div>
                    </fieldset>

                    {/*<div className="form-group">
                        <button
                            className="btn btn-primary"
                            type="submit"
                        >
                            <FormattedMessage
                                id="form.save"
                                defaultMessage="Save"
                            />
                        </button>
                        </div>*/}

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
