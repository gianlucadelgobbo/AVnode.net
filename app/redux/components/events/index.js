import {h, Component} from 'preact';
import AddEventForm from './addEvent'
import EventList from './list'

class Events extends Component {

    render() {

        const {} = this.props;

        return (
            <div>

                <AddEventForm/>

                <hr/>

                <EventList/>

            </div>
        );
    }
}

export default Events;
