import {h, Component} from 'preact';
import {connect} from 'preact-redux';
import {Modal} from 'react-bootstrap';
import {hideModal} from "./actions";
import {bindActionCreators} from "redux";

class ModalWrapper extends Component {
    render() {
        const {show, type, hideModal, children, title} = this.props;

        return (<div className="static-modal">
            <Modal animation={false} type={type} show={show} onHide={hideModal} enforceFocus={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {children}
                </Modal.Body>

                {/* <Modal.Footer /> */}

            </Modal>
        </div>);
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    hideModal
}, dispatch);

ModalWrapper = connect(
    null,
    mapDispatchToProps
)(ModalWrapper);

export default ModalWrapper;