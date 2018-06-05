import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Form from '../../../playlists/add';

class AddPlaylistModal extends Component {

    render() {

        return (
            <Form/>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddPlaylistModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPlaylistModal);

export default AddPlaylistModal;
