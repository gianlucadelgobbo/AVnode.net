import { h } from 'preact';
import { reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ImageDropzone from '../ImageDropzone';
import Layout from '../Layout';
import CrewNav from './CrewNav';
import Match from 'preact-router/match';

const CrewImagesForm = ({
    crew,
    intl,
    handleSubmit,
    saveCrew,
    addCrewProfileImage,
    addCrewTeaserImage
    }) => {
 
  const onProfileImageDrop = (crewId) => (files, _something, _ev) => {
      addCrewProfileImage(crewId, files[0]);
    };

  const onTeaserImageDrop = (crewId) => (files, _something, _ev) => {
      addCrewTeaserImage(crewId, files[0]);
    };

  return (
    <div>
    <div className="container-fluid">
      <Match>
        {({ url }) => <CrewNav url={url} />}
      </Match>
    </div>
        <Layout>
            <form onSubmit={handleSubmit(saveCrew)}>
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
                                defaultMessage="Crew Image"
                            />
                        </label>
                        {crew && crew.image ?
                            <div>
                                <img
                                    className="img-thumbnail mb-3"
                                    src={crew.image.publicUrl}
                                    alt={`image of ${crew.stagename}`}
                                />
                            </div> :
                            null
                        }
                        <ImageDropzone
                            imageUploadInProgress={(crew && crew.profileImageUploadInProgress)}
                            onDrop={onProfileImageDrop(crew._id)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">
                            <FormattedMessage
                                id="teaserImage"
                                defaultMessage="Teaser Image"
                            />
                        </label>
                        {crew && crew.teaserImage ?
                            <div>
                                <img
                                    className="img-thumbnail mb-3"
                                    src={crew.teaserImage.publicUrl}
                                    alt={`image of ${crew.stagename}`}
                                />
                            </div> :
                            null
                        }
                        <ImageDropzone
                            imageUploadInProgress={(crew && crew.teaserImageUploadInProgress)}
                            onDrop={onTeaserImageDrop(crew._id)}
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
        </div>
    );
};
export default injectIntl(reduxForm({
  form: 'crewimages',
  enableReinitialize: true
})(CrewImagesForm));
