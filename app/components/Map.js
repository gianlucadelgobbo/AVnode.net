import React, { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

const styles = {
  mapCard: {
    margin: '10px 0'
  },
  map: {
    height: '200px'
  }
};

class Map extends React.Component {
  constructor(props) {
		super(props);
	}
	componentDidMount() {
		const map = new google.maps.Map(document.getElementById('map-' + this.props.venue._id), {
			zoom: 12,
			center: this.props.venue.geometry.location
		});

		const marker = new google.maps.Marker({
			position: this.props.venue.geometry.location,
			map: map,
			title: this.props.venue.address
		});
	}
	render() {
		return (
			<div class='card' style={styles.mapCard}>
				<div style={styles.map} class='card-img-top' id={'map-' + this.props.venue._id}></div>
				<div class='card-block'>
					<p class='card-text'>
          <div class="pull-left">
            {this.props.venue.address}
          </div>
          <div class="pull-right">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => this.props.onDelete(this.props.venue._id)}
              >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          </p>
				</div>
			</div>
		);
	}
}

export default Map;
