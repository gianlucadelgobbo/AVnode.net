import React, { h } from 'preact';

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
		console.log('map props:' + JSON.stringify(props));
		console.log('map props place:' + JSON.stringify(props.place));
		console.log('map props place.address:' + JSON.stringify(props.place.address));
	}
	componentDidMount() {
		const map = new google.maps.Map(document.getElementById('map-' + this.props.place._id), {
			zoom: 12,
			center: this.props.place.address.geometry.location
		});
		// console.log('map-' + this.props.place._id + ' address: ' + JSON.stringify(this.props.place.address));
		const marker = new google.maps.Marker({
			position: this.props.place.address.geometry.location,
			map: map,
			title: this.props.place.address.formatted_address
		});
	}
	render() {
		return (
			<div className='card' style={styles.mapCard}>
				<div style={styles.map} className='card-img-top' id={'map-' + this.props.place._id}></div>
				<div className='card-block'>
					<p className='card-text'>
						<div className="pull-left">
							{this.props.place.name}
						</div>
						<div className="pull-right">
							<button
								type="button"
								className="btn btn-danger"
								onClick={() => this.props.onDelete(this.props.place._id)}
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

export default Map;
