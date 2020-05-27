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
import { Link } from "react-router-dom";
import { injectIntl, FormattedMessage } from "react-intl";
import Table from "./table";

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
  renderTable(list) {
    //const { list = {} } = this.props;

    const VideoItem = {
      label_0: <FormattedMessage id="VideoTitleTitle" defaultMessage="Image" />,
      label_1: <FormattedMessage id="VideoNameTitle" defaultMessage="Name" />,
      label_2: <FormattedMessage id="VideoType" defaultMessage="Type" />,
      label_3: <FormattedMessage id="VideoProductionTitle" defaultMessage="Productions" />,
      label_4: <FormattedMessage id="VideoCreationDateTitle" defaultMessage="Date" />,
      label_5: <FormattedMessage id="VideoLinks" defaultMessage="Links" />
    };

    return (
      <Table
        data={list}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {VideoItem.label_0}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "VideoImg",
            className: "VideoImg",
            accessor: "VideoImg",
            maxWidth: 200,
            Cell: props => {
              const { row, original } = props;
              return (
                <Link to={`/admin/videos/${original._id}/public`}>
                  <img
                    className = "img-fluid"
                    src={
                      original.imageFormats !== undefined
                        ? original.imageFormats.small
                        : ""
                    }
                  />
                </Link>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {VideoItem.label_1}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "VideoTitle",
            className: "VideoTitle",
            accessor: original => original.title,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  <div><b><Link to={`/admin/videos/${original._id}/public`}> <i className="fa fa-edit" /> </Link> | <Link onClick={this.forceUpdate} to={`/videos/${original.slug}/`}> <i className="fa fa-eye" /> </Link> | {original.title}</b></div>
                  <div>{original.is_public===true ? <i className="fas fa-circle text-success" /> : <i className="far fa-circle text-danger" />} Public</div>
                  {!original.media ? (
                    <b>NO VIDEO FILE UPLOADED</b>
                  ) : (original.media.encoded===0 ? (
                    <b>VIDEO ENCODING IN PROGRESS</b>
                  ) : (original.media.encoded!=1 ? (
                    <b>VIDEO ENCODING FAILED</b>
                  ) : (
                    <div>
                      <div>
                      {original.media.durationHR && (
                        <span>{original.media.durationHR}</span>
                      )}
                      {original.media.originalname && (
                        <span> | {original.media.originalname}</span>
                      )}
                      </div>
                      <div><i className="fa fa-heart" /> {original.stats.likes} | <i className="fa fa-eye" /> {original.stats.visits}</div>
                    </div>
                  )))}
                </div>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {VideoItem.label_2}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "VideoType",
            className: "VideoType",
            accessor: original => original.categories && original.categories.length ? original.categories.map( item =>{return item.name}).join(", ") : "MISSING",
            width: 150,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                original.categories && original.categories.length ? original.categories.map( item =>{return item.name}).join(", ") : "MISSING"
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {VideoItem.label_3}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "VideoProduction",
            className: "VideoProduction",
            accessor: original => original.users && original.users.length ? original.users.map( item =>{return item.stagename}).join(", ") : "MISSING USERS",
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <ul>
                  {original.users.map((user, i) => (
                    <li key={i}>{user.stagename}</li>
                  ))}
                </ul>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {VideoItem.label_4}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "VideoDate",
            className: "VideoDate",
            width: 100,
            accessor: original => original.createdAt,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <p>{new Date(original.createdAt).toLocaleDateString()}<br />{new Date(original.updatedAt).toLocaleDateString()}</p>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {VideoItem.label_5}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "VideoLinks",
            className: "VideoLinks",
            accessor: original => 
              original.events && original.events.length && original.performances && original.performances.length ? 
                original.events.map( item =>{return item.title}).concat(original.performances.map( item =>{return item.title})).join(", ") : 
                original.events && original.events.length ? original.events.map( item =>{return item.title}) : 
                original.performances && original.performances.length ? original.performances.map( item =>{return item.title}) : "MISSING USERS",
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  {original.events && original.events.length>0 ?
                  <div>
                    <div>Events</div>
                    <ul>
                      {original.events.map((event, i) => (
                        <li key={i}>{event.title}</li>
                      ))}
                    </ul>
                  </div> : ""}
                  {original.performances && original.performances.length>0 ?
                  <div>
                    <div>Performances</div>
                    <ul>
                      {original.performances.map((performance, i) => (
                        <li key={i}>{performance.title}</li>
                      ))}
                    </ul>
                  </div> : ""}
                </div>
              );
            }
          }

        /*{
                      Header: this.getIntlString({id:ACTION}),
                      id: "actions",
                      width: 100,
                      Cell: (props) => {
                          const {original} = props;
                          return <Button
                              bsStyle="danger"
                              className="btn-block"
                              onClick={() =>
                                  showModal({
                                      type: MODAL_REMOVE,
                                      props: {
                                          onRemove: () => removeModel({id: original._id})
                                      }
                                  })}
                          >
                              <i className="fa fa-trash" data-toggle="tooltip" data-placement="top"/>
                          </Button>
                      }

                  }*/
        ]}
      />
    );
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
            <h3><Link to={`/admin/videos/${v._id}/public`}><i className="fas fa-edit"></i></Link> | <i className="fa fa-heart"></i> {v.stats.likes} | <Link onClick={this.forceUpdate} to={`/videos/${v.slug}/`} target={`_blank`}><i className="fa fa-eye"></i> {v.stats.visits}</Link> | {v.title}</h3>
            {!v.media ? (
              <b>NO VIDEO FILE UPLOADED</b>
            ) : (v.media.encoded===0 ? (
              <b>VIDEO ENCODING IN PROGRESS</b>
            ) : (v.media.encoded!=1 ? (
              <b>VIDEO ENCODING FAILED</b>
            ) : (
              <div>
                <div>
                {v.media.durationHR && (
                  <span>{v.media.durationHR}</span>
                )}
                {v.media.originalname && (
                  <span> | {v.media.originalname}</span>
                )}
                </div>
                <ul className='commalist'>{v.users.map((item, index) => (
                  <li key={index}>{item.stagename}</li>
                ))}</ul>
              </div>
            )))}
            {v.categories && v.categories.length>0 && (
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
                className="fab fa-vimeo-square mr-3"
                data-toggle="tooltip"
                data-placement="top"
              />
              <i
                className="fab fa-youtube mr-3"
                data-toggle="tooltip"
                data-placement="top"
              />
              <i
                className="fab fa-facebook-square mr-3"
                data-toggle="tooltip"
                data-placement="top"
              />
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
              model.videos.length > 0 && (this.renderTable(model.videos))}
              {/*model.videos.map(this.renderVideo.bind(this))*/}

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
