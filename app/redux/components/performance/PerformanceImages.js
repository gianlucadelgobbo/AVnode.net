import { h } from 'preact';
import { connect } from 'preact-redux';
import { reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import PerformanceNav from './PerformanceNav';
import Match from 'preact-router/match';
import ImageDropzone from '../ImageDropzone';

import {
  addPerformanceImage,
  addPerformanceTeaserImage
} from '../../reducers/actions';

let PerformanceForm = props => {
  const { dispatch, performance } = props;

  const onImageDrop = (performanceId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addPerformanceImage(performanceId, file));
  };

  const onTeaserImageDrop = (performanceId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addPerformanceTeaserImage(performanceId, file));
  };

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <PerformanceNav url={url} />}
        </Match>
      </div>
      <Layout>
          <div className="form-group">
          {performance.file ? 
                            <div className="form-group">
                                <label>Thumbnail</label>
                                <p></p>
                                <img
                                className="img-small mb-3"
                                src={`${performance.squareThumbnailUrl}`}       
                                alt={`image of ${performance.title}`}
                                />
                            </div>
                            : 
                            null
                        }
            <label htmlFor="teaserImage">
              <FormattedMessage
                id="teaserImage"
                defaultMessage="Teaser Image"
              />
            </label>
            {performance && performance.teaserImage ?
              <img
                className="img-thumbnail mb-3"
                src={performance.teaserImageFormats.large}
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
                src={performance.imageFormats.medium}
                alt={`image of ${performance.title}`}
              /> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(performance && performance.imageUploadInProgress)}
              onDrop={onImageDrop(props._id)}
            />
          </div>
      </Layout>
    </div>
  );
};

PerformanceForm = injectIntl(reduxForm({ form: 'performanceImages' })(PerformanceForm));

const PerformanceImages = props => {
  return (
    <PerformanceForm
      initialValues={props.performance}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    performance: (state.user.performances.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  addPerformanceImage: dispatch(addPerformanceImage),
  addPerformanceTeaserImage: dispatch(addPerformanceTeaserImage)
});
export default connect(mapStateToProps, mapDispatchToProps)(PerformanceImages);
