import {h, Component} from 'preact';
import AddEventForm from './addEvent'
import EventList from './list'
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";

class Events extends Component {

    render() {

        return (
            <div>

                <AddEventForm/>

                <hr/>

                <EventList/>

            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

Events = connect(
    mapStateToProps,
    mapDispatchToProps
)(Events);

export default Events;
