import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ImageDropzone from '../ImageDropzone';
import Layout from '../Layout';
import {
    addUserProfileImage,
    addUserTeaserImage,
    editUserImages
  } from '../../reducers/actions';

let ProfileImagesForm = props => {
    const { handleSubmit, dispatch, user, intl } = props;

    const onProfileImageDrop = (userId) => (files, _something, _ev) => {
        return dispatch(addUserProfileImage(userId, files[0]));
    };

    const onTeaserImageDrop = (userId) => (files, _something, _ev) => {
        return dispatch(addUserTeaserImage(userId, files[0]));
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
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
                                    alt={`image of ${user.stagename}`}
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
                                    alt={`image of ${user.stagename}`}
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

ProfileImagesForm = injectIntl(reduxForm({ form: 'userimages' })(ProfileImagesForm));

const EditProfileImages = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editUserImages(props));
  };
  return (
    <ProfileImagesForm
      initialValues={props.user}
      onSubmit={onSubmit}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
    complete: dispatch(editUserImages)
  });

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileImages);
