import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showModal } from "../modal/actions";
import Loading from "../loading";
import ErrorMessage from "../errorMessage";
import ItemNotFound from "../itemNotFound";
import {
  MODAL_ADD_MEDIA,
  MODAL_REMOVE,
  MODAL_SAVED,
  MODAL_ADD_VIDEOS,
  MODAL_ADD_PERFORMANCES_VIDEOS
} from "../modal/constants";
import { Player } from "video-react";
import "video-react/dist/video-react.css"; // import css
import { Button, Image } from "react-bootstrap";
import { NO_VIDEO_TO_SHOW } from "../common/form/labels";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";

// 1. LOADING BAR add actions generators
import { showLoading, hideLoading } from "react-redux-loading-bar";

class Video extends Component {
  componentDidMount() {
    const { fetchModel, id } = this.props;
    fetchModel({ id });
  }
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  // Modify model from API to create form initial values
  getInitialValues() {
    const { user } = this.props;

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
    // 3. LOADING BAR get action from props
    const {
      showModal,
      saveModel,
      model,
      showLoading,
      hideLoading
    } = this.props;
    const modelToSave = this.createModelToSave(values);

    // Add auth user _id
    modelToSave._id = model._id;

    // 4. LOADING BAR show loading bar
    showLoading();

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(() => {
      // 5. LOADING BAR hide loading bar
      hideLoading();

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
    const { removeModel, model } = this.props;
    const modelToRemove = this.createModelToRemove(values);
    // Add auth user _id
    modelToRemove._id = model._id;

    return removeModel(modelToRemove);
  }

  renderVideo(v, i) {
    const { showModal } = this.props;

    return (
      <div key={i}>
        <div className="row">
          <div className="col-sm-3">
            <Link to={`/admin/videos/${v._id}/public`}>
              <Image
                src={v.imageFormats ? v.imageFormats.small : ""}
                className="img-fluid"
              />
            </Link>
          </div>
          <div className="col-sm-9">
            <h3><Link to={`/admin/videos/${v._id}/public`}><i className="fas fa-edit"></i></Link> | <i className="fa fa-heart"></i> {v.stats.likes} | <Link to={`/videos/${v.slug}/`} target={`_blank`}><i className="fa fa-eye"></i> {v.stats.visits}</Link> | {v.title}</h3>
            <div>{v.media.durationHR} | {v.media.originalname}
            {v.media.originalname && (
              <span> | {v.media.originalname}</span>
            )}</div>
            <ul className='commalist'>{v.users.map((item, index) => (
              <li key={index}>{item.stagename}</li>
            ))}</ul>
            {v.categories && v.categories.length && (
              <div><span>Type: </span>
              <ul className='commalist'>{v.categories.map((item, index) => (
                <li key={index}><b>{item.name}</b></li>
              ))}</ul></div>
            )}
          </div>
          {/*<div className="row">
            <div className="col-sm-12">
              <Button
                bsStyle="danger"
                className="btn-block"
                onClick={() =>
                  showModal({
                    type: MODAL_REMOVE,
                    props: {
                      onRemove: () => this.onRemove(v)
                    }
                  })
                }
              >
                <i
                  className="fa fa-trash"
                  data-toggle="tooltip"
                  data-placement="top"
                />
              </Button>
            </div>
          </div>*/}
        </div>
        <hr />
      </div>
    );
  }

  render() {
    const {
      model,
      title,
      modal,
      showModal,
      isFetching,
      errorMessage,
      history,
      id,
      type
    } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-9">
            <h3 className="labelField">{title}</h3>
          </div>
          <div className="col-md-3">
            <Button
              bsStyle="success"
              className="float-right"
              onClick={() =>
                showModal({
                  type: modal,
                  props: { history, id }
                })
              }
            >
              <i
                className="fa fa-plus"
                data-toggle="tooltip"
                data-placement="top"
              />
            </Button>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12">
            {isFetching && !model && <Loading />}

            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

            {!errorMessage && !isFetching && !model && <ItemNotFound />}

            {!errorMessage &&
              !isFetching &&
              model &&
              Array.isArray(model.videos) &&
              model.videos.length > 0 && (
                <div>
                  {model.videos.map(this.renderVideo.bind(this))}
                </div>
              )}

            {!errorMessage &&
              !isFetching &&
              model &&
              Array.isArray(model.videos) &&
              model.videos.length === 0 && (
                <div className="Novideo">
                  {this.getIntlString({ id: NO_VIDEO_TO_SHOW })}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      // 2. LOADING BAR map actions to props
      showLoading,
      hideLoading
    },
    dispatch
  );

Video = connect(mapStateToProps, mapDispatchToProps)(Video);

Video = injectIntl(Video);

export default Video;
