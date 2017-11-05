import React, { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

const styles = {
  placeSuggestionBox: {
    border: '1px solid #D3D3D3',
    borderRadius: '0 3px 3px 0'
  },
  placeSuggestion: {
    padding: '10px 13px',
    borderBottom: '1px solid #DBDBDB',
    cursor: 'pointer',
    background: 'white'
  }
};
/*                 
const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)
) */
class Place extends React.Component {
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

  delete(placeId) {
    this.props.delete(this.props.user._id, placeId);
  }
  save(place) {
    this.geocoder.geocode({ placeId: place.placeId }, (results, status) => {
      // verify if a Place name is set, otherwise use the address
      if (this.state.placename.length < 1) this.state.placename = place.title;
      results[0].placename = this.state.placename;      
      this.props.complete(this.props.user._id, results[0]);
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
        <label htmlFor="places">
          <FormattedMessage
            id="places"
            defaultMessage="Places"
          />
        </label>
        <div class="google-maps-places">
          <Field
              className="form-control"
              name="placename"
              component="input"
              placeholder='Input a new Address name (Home or Work or ...)'
              onChange={(event, newValue, previousValue) => {
                // console.log('newValue ' + newValue + ' previousValue ' + previousValue);
                this.state.placename = newValue;
              }}
          />
          <Field
            className="form-control"
            name="suggest-place-for-user"
            component="input"
            placeholder='Search for an address (format: street number, street ...)'
            {...inputProps}
          />
          {this.state.suggestions.length > 0 && (
            <div
              style={styles.placeSuggestionBox}
            >
              {this.state.suggestions.map((p, idx) => (
                <div
                  key={p.placeId}
                  onClick={() => this.save(p)}
                  style={styles.placeSuggestion}
                >
                  <i class="fa fa-map-marker"></i> &nbsp;
                  {p.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="manual_input"
              defaultMessage="Or manually input address"
            />
          </legend>
          <div className="row">
            <div className="col-md-3 form-group">
              <label htmlFor="street_number">
                <FormattedMessage
                  id="street_number"
                  defaultMessage="Street Number"
                />
              </label>
              <Field
                className="form-control"
                name="street_number"
                component="input"
              />
            </div>
            <div className="col-md-9 form-group">
              <label htmlFor="route">
                <FormattedMessage
                  id="route"
                  defaultMessage="Street"
                />
              </label>
              <Field
                className="form-control"
                name="route"
                component="input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 form-group">
              <label htmlFor="postal_code">
                <FormattedMessage
                  id="postal_code"
                  defaultMessage="Postal code"
                />
              </label>
              <Field
                className="form-control"
                name="postal_code"
                component="input"
              />
            </div>
            <div className="col-md-9 form-group">
              <label htmlFor="locality">
                <FormattedMessage
                  id="locality"
                  defaultMessage="Locality"
                />
              </label>
              <Field
                className="form-control"
                name="locality"
                component="input"               
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-9 form-group">
              <label htmlFor="administrative_area_level_1">
                <FormattedMessage
                  id="region"
                  defaultMessage="Region"
                />
              </label>
              <Field
                className="form-control"
                name="administrative_area_level_1"
                component="input"
              />
            </div>
            <div className="col-md-3 form-group">
              <label htmlFor="country">
                <FormattedMessage
                  id="country"
                  defaultMessage="Country"
                />
              </label>
              <Field
                className="form-control"
                name="country"
                component="input"
              />
            </div>
          </div>
        </fieldset>

      </div>
    );
  }
}

Place.propTypes = {
  inputProps: (props, propName) => {
    const inputProps = props[propName];
  },
};

export default Place;
