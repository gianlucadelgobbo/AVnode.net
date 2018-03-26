import {h, render, Component} from 'preact';
import {bindActionCreators} from "redux";
import {getEvents, getIsFetching, getErrorMessage} from "./selectors";
import {connect} from "preact-redux";
import {showModal} from "../../modal/actions";
import {fetchEvents, removeEvent} from "./actions";
import {Button} from 'react-bootstrap';
import {Link} from 'preact-router/match';
import {MODAL_REMOVE} from "../../modal/constants";

class EventList extends Component {


    componentDidMount() {
        const {fetchEvents} = this.props;
        fetchEvents();
    }

    renderEvent(event, index) {

        const {showModal, removeEvent} = this.props;


        return <div className="col-md-12" key={index}>
            <div className="row">

                <div className="col-md-10">
                    <Link href={`/admin/event/public/${event.id}`}>
                        {event.title}
                    </Link>
                </div>

                <div className="col-md-2">
                    <Button
                        bsStyle="danger"
                        onClick={() =>
                            showModal({
                                type: MODAL_REMOVE,,
                                props: {
                                    onRemove: () => removeEvent({id: event.id})
                                }

                            })}
                    >
                        <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                    </Button>
                </div>

            </div>
        </div>
    }

    render() {

        const {events, isFetching, errorMessage} = this.props;

        return (
            <div className="row">

                {!events.length && <div>No events to display</div>}

                {isFetching && <div>Loading..</div>}

                {errorMessage && <div>{errorMessage}</div>}

                {events && events.map(this.renderEvent.bind(this))}

            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    events: getEvents(state),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    fetchEvents,
    removeEvent
}, dispatch);

EventList = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList);

export default EventList;
