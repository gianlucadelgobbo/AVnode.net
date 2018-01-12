import React, { h } from 'preact';
import { Field } from 'redux-form';
import { FormattedMessage } from 'preact-intl';

const styles = {
  mapCard: {
    margin: '10px 0'
  },
  map: {
    height: '200px'
  },
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

class Map extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const map = new google.maps.Map(document.getElementById('map-' + this.props.venue._id), {
      zoom: 12,
      center: this.props.venue.address.geometry.location
    });

    const marker = new google.maps.Marker({
      position: this.props.venue.address.geometry.location,
      map: map,
      title: this.props.venue.address.formatted_address
    });
  }
  render() {
    return (
			<div className='card' style={styles.mapCard}>
				<div style={styles.map} className='card-img-top' id={'map-' + this.props.venue._id}></div>
				<div className='card-block'>
					<p className='card-text'>
          <div className="pull-left">
            {this.props.venue.address.placename} : {this.props.venue.address.formatted_address}
          </div>
          <div className="pull-right">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => this.props.onDelete(this.props.venue._id)}
              >
              <i className="fa fa-trash"></i>
            </button>
          </div>
          </p>
				</div>
			</div>
    );
  }
}

class Venue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      placename: ''
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
      suggestions: [],
      placename: ''
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

  formatAddress(location, placename) {
    let street_number = '';
    let route = '';
    let postal_code = '';
    let locality = '';
    let administrative_area_level_1 = '';
    let country = '';
    console.log('formatAddress:' + JSON.stringify(location));
    for (let i in location.address_components) {
      if (location.address_components[i].types[0] == 'street_number') street_number = location.address_components[i].long_name;
      if (location.address_components[i].types[0] == 'route') route = location.address_components[i].long_name;
      if (location.address_components[i].types[0] == 'postal_code') postal_code = location.address_components[i].long_name;
      if (location.address_components[i].types[0] == 'locality') locality = location.address_components[i].long_name;
      if (location.address_components[i].types[0] == 'administrative_area_level_1') administrative_area_level_1 = location.address_components[i].long_name;
      if (location.address_components[i].types[0] == 'country') country = location.address_components[i].long_name;
    }

		// BL TODO check if place_id is unique 
    const address = {
      formatted_address: location.formatted_address, // BL gmap response formatted_address
      street_number: street_number,
      route: route,
      postal_code: postal_code,
      locality: locality,
      administrative_area_level_1,
      country: country,
      geometry: location.geometry,
      place_id: location.place_id, // unique
      placename: placename, // BL friendly name indexed for search
      is_primary: true
    };
    return address;
  }
  save(place) {
    this.geocoder.geocode({placeId: place.placeId}, (results, status) => {
      console.log('Venue place: ' + JSON.stringify(place));
      console.log('Venue place.placeId: ' + place.placeId);
      console.log('this.props.event._id: ' + this.props.event._id);
      console.log('this.state.placename: ' + this.state.placename); 
      // verify if a Venue placename is set, otherwise use the address
      console.log('Venue save place,status:' + status);
      if (status === 'ZERO_RESULTS') {
        console.log('Error, status:' + status);
      } else {
        if (this.state.placename.length < 1) this.state.placename = place.title;
        results[0].placename = this.state.placename;
        this.props.complete(this.props.event._id, this.formatAddress(results[0], this.state.placename));
        this.reset();
      }

    });
  }

  getInputProps() {
    const defaultInputProps = {
      type: 'text',
    };

    return {
      ...defaultInputProps,
      ...this.props.inputProps,
      onKeyDown: (event) => {
        this.fetchPredictions(event);
      },
    };
  }

  render() {
    const inputProps = this.getInputProps();
    return (
      <div className="form-group">
        <label htmlFor="venues">
          <FormattedMessage
            id="venues"
            defaultMessage="Venues"
          />
        </label>
        <div className="google-maps-places">
          <Field
              className="form-control"
              name="placename"
              component="input"
              placeholder='Input a new Venue name'
              onChange={(event, newValue, previousValue) => {
                this.state.placename = newValue;
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

                  <i className="fa fa-map-marker"></i> &nbsp;
                  {p.title}
                </div>
              ))}
            </div>
          )}
          {this.props.event && this.props.event.venues.length > 0 && this.props.event.venues.map((v) => (
            <Map venue={v} onDelete={this.delete} />
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
