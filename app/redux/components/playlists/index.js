import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import ModelTable from './table'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {MODAL_ADD_PLAYLIST} from "../modal/constants";
import {showModal} from "../modal/actions";

class Playlist extends Component {

    render() {

        const {showModal} = this.props;

        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="row mt-3">
                        <div className="col-md-10">
                            <h3 className="labelField">PLAYLISTS</h3>
                        </div>
                        <div className="col-md-2">
                            <Button
                                bsStyle="success"
                                className="float-right"
                                onClick={() => showModal({
                                    type: MODAL_ADD_PLAYLIST
                                })}>
                                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                            </Button>

                        </div>
                    </div>

                    <hr/>

                    <div className="row">
                        <div className="col-md-12">
                            <ModelTable/>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal
}, dispatch);

Playlist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Playlist);

export default Playlist;
