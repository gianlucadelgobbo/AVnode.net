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
    }
    componentDidMount() {
        const map = new google.maps.Map(document.getElementById('map-' + this.props.place._id), {
            zoom: 12,
            center: this.props.place.geometry.location
        });
        console.log('map-' + this.props.place._id);
        const marker = new google.maps.Marker({
            position: this.props.place.geometry.location,
            map: map,
            title: this.props.place.address
        });
    }
    render() {
        return (
            <div class='card' style={styles.mapCard}>
                <div style={styles.map} class='card-img-top' id={'map-' + this.props.place._id}></div>
                <div class='card-block'>
                    <p class='card-text'>
                        <div class="pull-left">
                            {this.props.place.address}
                        </div>
                        <div class="pull-right">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => this.props.onDelete(this.props.place._id)}
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
