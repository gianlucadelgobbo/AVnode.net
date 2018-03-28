import {h, Component} from 'preact';
import {Button} from 'react-bootstrap';
import EventList from './list'
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";
import {MODAL_ADD_EVENT} from "../modal/constants";
import {showModal} from "../modal/actions";

class Events extends Component {

    render() {

        const {showModal} = this.props;

        return (
            <div className="row">
                <div className="col-md-12">

                    <Button
                        bsStyle="success"
                        className="pull-right"
                        onClick={() => showModal({
                            type: MODAL_ADD_EVENT
                        })}>
                        <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                    </Button>

                    <hr/>

                    <EventList/>

                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal
}, dispatch);

Events = connect(
    mapStateToProps,
    mapDispatchToProps
)(Events);

export default Events;
