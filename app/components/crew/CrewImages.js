import { h } from 'preact';
import { connect } from 'preact-redux';
import { reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import CrewNav from './CrewNav';
import Match from 'preact-router/match';
import ImageDropzone from '../ImageDropzone';

import {
  addCrewImage,
  addCrewTeaserImage,
  addOrgLogoImage
} from '../../reducers/actions';

let CrewForm = props => {
  const { dispatch, crew } = props;

  const onImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewImage(crewId, file));
  };

  const onTeaserImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewTeaserImage(crewId, file));
  };

  const onOrgLogoDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addOrgLogoImage(crewId, file));
  };

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <CrewNav url={url} crew={props.crew} />}
        </Match>
      </div>
      <Layout>
        <div className="form-group">
          <label htmlFor="teaserImage">
            <FormattedMessage
              id="teaserImage"
              defaultMessage="Teaser Image"
            />
          </label>
          {crew && crew.teaserImage ?
            <img
              className="img-thumbnail mb-3"
              src={crew.teaserImage.publicUrl}
              alt={`image of ${crew.title}`}
            /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
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
          {crew && crew.image ?
            <img
              className="img-thumbnail mb-3"
              src={crew.image.publicUrl}
              alt={`image of ${crew.title}`}
            /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_logo">
            <FormattedMessage
              id="org_logo"
              defaultMessage="Organisation logo (.svg only)"
            />
          </label>
          &nbsp;
          <span className="badge badge-danger">
            <FormattedMessage
              id="private"
              defaultMessage='Private'
            />
          </span>
          {crew && crew.org_logo ?
            <div>
              <img
                className="img-thumbnail mb-3"
                src={crew.org_logo.publicUrl}
                alt={`Logo of ${crew.org_name}`}
              />
            </div> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onOrgLogoDrop(props._id)}
          />
        </div>
      </Layout>
    </div>
  );
};

CrewForm = injectIntl(reduxForm({ form: 'crewImages' })(CrewForm));

const CrewImages = props => {
  return (
    <CrewForm
      initialValues={props.crew}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  addCrewImage: dispatch(addCrewImage),
  addCrewTeaserImage: dispatch(addCrewTeaserImage)
});
export default connect(mapStateToProps, mapDispatchToProps)(CrewImages);
