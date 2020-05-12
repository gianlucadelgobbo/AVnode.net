import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { getList, getIsFetching, getErrorMessage } from "../selectors";
import { connect } from "react-redux";
import { showModal } from "../../modal/actions";
import { fetchList, removeModel } from "../actions";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MODAL_REMOVE } from "../../modal/constants";
import Loading from "../../loading";
import Table from "../../table";
import { injectIntl, FormattedMessage } from "react-intl";
import { ACTION } from "../../common/form/labels";

class ModelTable extends Component {
  componentDidMount() {
    const { fetchList } = this.props;
    fetchList();
  }

  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  renderTable() {
    const { showModal, removeModel, list } = this.props;
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
                  <div><b><Link to={`/admin/videos/${original._id}/public`}> <i className="fa fa-edit" /> </Link> | <Link to={`/videos/${original.slug}/`}> <i className="fa fa-eye" /> </Link> | {original.title}</b></div>
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

  render() {
    const { list, isFetching, errorMessage } = this.props;

    return (
      <div>
        {!list.length && <div>No Videos to display</div>}

        {isFetching && <Loading />}

        {errorMessage && <div>{errorMessage}</div>}

        {list && this.renderTable()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  list: getList(state),
  isFetching: getIsFetching(state),
  errorMessage: getErrorMessage(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      fetchList,
      removeModel
    },
    dispatch
  );

ModelTable = connect(mapStateToProps, mapDispatchToProps)(ModelTable);

export default injectIntl(ModelTable);
