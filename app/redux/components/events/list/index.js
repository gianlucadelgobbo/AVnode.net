import {h, Component} from 'preact';
import {bindActionCreators} from "redux";
import {getList, getIsFetching, getErrorMessage} from "../selectors";
import {connect} from "preact-redux";
import {showModal} from "../../modal/actions";
import {fetchList, removeModel} from "../actions";
import {Button} from 'react-bootstrap';
import {Link} from 'preact-router/match';
import {MODAL_REMOVE} from "../../modal/constants";
import Loading from '../../loading'

class EventList extends Component {

    componentDidMount() {
        const {fetchList} = this.props;
        fetchList();
    }

    renderEvent(event, index) {

        const {showModal, removeModel} = this.props;

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
                                type: MODAL_REMOVE,
                                props: {
                                    onRemove: () => removeModel({id: event.id})
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

                {isFetching && <Loading/>}

                {errorMessage && <div>{errorMessage}</div>}

                {events && events.map(this.renderEvent.bind(this))}

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    events: getList(state),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    fetchList,
    removeModel
}, dispatch);

EventList = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList);

export default EventList;
