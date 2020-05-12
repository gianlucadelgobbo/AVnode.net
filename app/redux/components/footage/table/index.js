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
    const FootageItem = {
      label_0: <FormattedMessage id="FootageTitleTitle" defaultMessage="Image" />,
      label_1: <FormattedMessage id="FootageNameTitle" defaultMessage="Name" />,
      label_2: <FormattedMessage id="FootageType" defaultMessage="Type" />,
      label_3: <FormattedMessage id="FootageProductionTitle" defaultMessage="Productions" />,
      label_4: <FormattedMessage id="FootageCreationDateTitle" defaultMessage="Date" />,
      label_5: <FormattedMessage id="FootageLinks" defaultMessage="Links" />
    };

    return (
      <Table
        data={list}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {FootageItem.label_0}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "FootageImg",
            className: "FootageImg",
            accessor: "FootageImg",
            maxWidth: 200,
            Cell: props => {
              const { row, original } = props;
              return (
                <Link to={`/admin/footage/${original._id}/public`}>
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
                  {FootageItem.label_1}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "FootageTitle",
            className: "FootageTitle",
            accessor: original => original.title,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  <div><b><Link to={`/admin/footage/${original._id}/public`}> <i className="fa fa-edit" /> </Link> | <Link to={`/footage/${original.slug}/`}> <i className="fa fa-eye" /> </Link> | {original.title}</b></div>
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
                  {FootageItem.label_2}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "FootageType",
            className: "FootageType",
            accessor: original => original.tags && original.tags.length ? original.tags.map( item =>{return item.tag}).join(", ") : "MISSING",
            width: 150,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                original.tags && original.tags.length ? original.tags.map( item =>{return item.tag}).join(", ") : "MISSING"
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {FootageItem.label_3}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "FootageProduction",
            className: "FootageProduction",
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
                  {FootageItem.label_4}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "FootageDate",
            className: "FootageDate",
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
                  {FootageItem.label_5}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "FootageLinks",
            className: "FootageLinks",
            accessor: original => original.playlists && original.playlists.length ? original.playlists.map( item =>{return item.title}) : "MISSING PLAYLISTS",
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  {original.playlists && original.playlists.length>0 ?
                  <div>
                    <div>Playlists</div>
                    <ul>
                      {original.playlists.map((event, i) => (
                        <li key={i}>{event.title}</li>
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
        {!list.length && <div>No Footage to display</div>}

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
