import React, { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Map from './Map';

const styles = {
  venueSuggestionBox: {
    border: '1px solid #D3D3D3',
    borderRadius: '0 3px 3px 0'
  },
  venueSuggestion: {
    padding: '10px 13px',
    borderBottom: '1px solid #DBDBDB',
    cursor: 'pointer',
    background: 'white'
  }
};

class Venue extends React.Component {
  constructor(props) {
    super(props);
    console.log('Venue props:' + JSON.stringify(props));
    this.state = {
      suggestions: [],
      name: ''
    };
    this.autocompleteCallback = this.autocompleteCallback.bind(this);
    this.delete = this.delete.bind(this);
  }
  componentDidMount() {
    if (!window.google) {
      throw new Error('Google Maps JavaScript API library must be loaded.');
    }

    if (!window.google.maps.places) {
      throw new Error('Google Maps Places library must be loaded');
    }

    this.geocoder = new google.maps.Geocoder;
    this.autocompleteService = new google.maps.places.AutocompleteService();
  }

  autocompleteCallback(predictions, status) {
    if (status === 'OK') {
      this.setState({
        suggestions: predictions.map((p) => ({
          title: p.description,
          placeId: p.place_id
        }))
      });
    }
  }

  reset() {
    this.setState({
      suggestions: []
    });
  }

  fetchPredictions(e) {
    if (e.target.value.length > 3) {
      this.autocompleteService.getPlacePredictions({
        input: e.target.value
      }, this.autocompleteCallback);
    }
  }

  delete(venueId) {
    this.props.delete(this.props.event._id, venueId);
  }
  save(place) {
    this.geocoder.geocode({ placeId: place.placeId }, (results, status) => {
       console.log('Venue place: ' + JSON.stringify(place));
      console.log('Venue results[0]: ' + JSON.stringify(results[0]));
      console.log('this.state.name: ' + this.state.name); 
      // verify if a Venue name is set, otherwise use the address
      if (this.state.name.length < 1) this.state.name = place.title;
      results[0].name = this.state.name;
      this.props.complete(this.props.event._id, results[0]);
      this.reset();
    });
  }

  getInputProps() {
    const defaultInputProps = {
      type: "text",
    }

    return {
      ...defaultInputProps,
      ...this.props.inputProps,
      onKeyDown: (e) => {
        this.fetchPredictions(e)
      },
    }
  }

  render() {
    const inputProps = this.getInputProps();
    return (
      <div className="form-group">
        <label htmlFor="venues">
          <FormattedMessage
            id="venue.edit.form.label.venues"
            defaultMessage="Venues"
          />
        </label>
        <div class="google-maps-places">
          <Field
              className="form-control"
              name="name"
              component="input"
              placeholder='Input a new Venue name'
              onChange={(event, newValue, previousValue) => {
                // console.log('newValue ' + newValue + ' previousValue ' + previousValue);
                this.state.name = newValue;
              }}
          />
          <Field
            className="form-control"
            name="suggest-venue-for-event"
            component="input"
            placeholder='Search for an address for this new Venue'
            {...inputProps}
          />
          {this.state.suggestions.length > 0 && (
            <div
              style={styles.venueSuggestionBox}
            >
              {this.state.suggestions.map((p, idx) => (
                <div
                  key={p.placeId}
                  onClick={() => this.save(p)}
                  style={styles.venueSuggestion}
                >

                  <i class="fa fa-map-marker"></i> &nbsp;
                  {p.title}
                </div>
              ))}
            </div>
          )}
          {this.props.event && this.props.event.venues.length > 0 && this.props.event.venues.map((v) => (
            <Map place={v} onDelete={this.delete} />
          ))}
        </div>
      </div>
    );
  }
}

Venue.propTypes = {
  inputProps: (props, propName) => {
    const inputProps = props[propName];
  },
};

export default Venue;
