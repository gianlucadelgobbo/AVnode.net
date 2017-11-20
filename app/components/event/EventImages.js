import { h } from 'preact';
import { connect } from 'preact-redux';
import { reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import EventNav from './EventNav';
import Match from 'preact-router/match';
import ImageDropzone from '../ImageDropzone';

import {
  addEventImage,
  addEventTeaserImage
} from '../../reducers/actions';

let EventForm = props => {
  const { dispatch, event } = props;

  const onImageDrop = (eventId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addEventImage(eventId, file));
  };

  const onTeaserImageDrop = (eventId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addEventTeaserImage(eventId, file));
  };

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <EventNav url={url} event={props.event} />}
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
            {event && event.teaserImage ?
              <img
                className="img-thumbnail mb-3"
                src={event.teaserImage.publicUrl}
                alt={`image of ${event.title}`}
              /> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(event && event.imageUploadInProgress)}
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
            {event && event.image ?
              <img
                className="img-thumbnail mb-3"
                src={event.image.publicUrl}
                alt={`image of ${event.title}`}
              /> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(event && event.imageUploadInProgress)}
              onDrop={onImageDrop(props._id)}
            />
          </div>
      </Layout>
    </div>
  );
};

EventForm = injectIntl(reduxForm({ form: 'event' })(EventForm));

const EventImages = props => {
  return (
    <EventForm
      initialValues={props.event}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    event: (state.user.events.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  addEventImage: dispatch(addEventImage),
  addEventTeaserImage: dispatch(addEventTeaserImage)
});
export default connect(mapStateToProps, mapDispatchToProps)(EventImages);
