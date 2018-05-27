import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import {showModal} from "../modal/actions";
import Loading from '../loading'
import ErrorMessage from '../errorMessage'
import ItemNotFound from '../itemNotFound';
import {MODAL_ADD_MEDIA, MODAL_REMOVE, MODAL_SAVED} from "../modal/constants";
import {Player} from 'video-react';
import "video-react/dist/video-react.css"; // import css
import {Button} from 'react-bootstrap';

class Videos extends Component {

    componentDidMount() {
        const {fetchModel, id} = this.props;
        fetchModel({id});
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};

        return v;
    }

    // Add video
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        // Add auth user _id
        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    // Remove video
    createModelToRemove(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    onRemove(values) {
        const {removeModel, model} = this.props;
        const modelToRemove = this.createModelToRemove(values);
        // Add auth user _id
        modelToRemove._id = model._id;

        return removeModel(modelToRemove);
    }

    renderVideo(v, i) {

        const {showModal} = this.props;


        return <div className="col-md-6" key={i}>
            <div className="row">
                <div className="col-sm-11">
                    <h3>{v.title}</h3>
                    <Player
                        playsInline
                        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                    />
                </div>
                <div className="col-sm-1">
                    <Button bsStyle="danger"
                            onClick={() =>
                                showModal({
                                    type: MODAL_REMOVE,
                                    props: {
                                        onRemove: () => this.onRemove(v)
                                    }
                                })}
                    >
                        <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                    </Button>
                </div>
            </div>


            <br/>
        </div>
    }

    render() {

        const {model, showModal, isFetching, errorMessage} = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Button
                            bsStyle="success"
                            className="pull-right"
                            onClick={() => showModal({
                                type: MODAL_ADD_MEDIA,
                                props: {
                                    onSubmit: this.onSubmit.bind(this)
                                }
                            })}>
                            <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                        </Button>

                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <br/>
                        {isFetching && !model && <Loading/>}

                        {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                        {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                        {!errorMessage &&
                        !isFetching &&
                        model &&
                        Array.isArray(model.videos) &&
                        model.videos.length > 0 &&
                        <div className="row">
                            {model.videos.map(this.renderVideo.bind(this))}
                        </div>}

                        {!errorMessage &&
                        !isFetching &&
                        model &&
                        Array.isArray(model.videos) &&
                        model.videos.length === 0 &&
                        <div>
                            No video to show
                        </div>}

                    </div>
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
}, dispatch);

Videos = connect(
    mapStateToProps,
    mapDispatchToProps
)(Videos);

export default Videos;
