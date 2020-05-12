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
    const PlaylistsItem = {
      label_0: <FormattedMessage id="PlaylistsTitleTitle" defaultMessage="Image" />,
      label_1: <FormattedMessage id="PlaylistsNameTitle" defaultMessage="Name" />,
      label_3: <FormattedMessage id="PlaylistsProductionTitle" defaultMessage="Productions" />,
      label_4: <FormattedMessage id="PlaylistsCreationDateTitle" defaultMessage="Date" />,
      label_5: <FormattedMessage id="PlaylistsLinks" defaultMessage="Links" />
    };

    return (
      <Table
        data={list}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {PlaylistsItem.label_0}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "PlaylistsImg",
            className: "PlaylistsImg",
            accessor: "PlaylistsImg",
            maxWidth: 200,
            Cell: props => {
              const { row, original } = props;
              return (
                <Link to={`/admin/playlists/${original._id}/public`}>
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
                  {PlaylistsItem.label_1}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "PlaylistsTitle",
            className: "PlaylistsTitle",
            accessor: original => original.title,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  <div><b><Link to={`/admin/playlists/${original._id}/public`}> <i className="fa fa-edit" /> </Link> | <Link to={`/playlists/${original.slug}/`}> <i className="fa fa-eye" /> </Link> | {original.title}</b></div>
                  <div>{original.is_public===true ? <i className="fas fa-circle text-success" /> : <i className="far fa-circle text-danger" />} Public</div>
                  {!original.footage.length ? 
                    <b>NO FOOTAGE FILE </b> :
                    <div><i className="fa fa-file-download" /> {original.stats.downloads} | <i className="fa fa-heart" /> {original.stats.likes} | <i className="fa fa-eye" /> {original.stats.visits}</div>}
                </div>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {PlaylistsItem.label_3}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "PlaylistsProduction",
            className: "PlaylistsProduction",
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
                  {PlaylistsItem.label_4}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "PlaylistsDate",
            className: "PlaylistsDate",
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
                  {PlaylistsItem.label_5}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "PlaylistsLinks",
            className: "PlaylistsLinks",
            accessor: original => original.footage && original.footage.length ? original.footage.map( item =>{return item.title}) : "MISSING PLAYLISTS",
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  {original.footage && original.footage.length>0 ?
                  <div>
                    <div>Footage</div>
                    <ul>
                      {original.footage.map((event, i) => (
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
        {!list.length && <div>No Playlist to display</div>}

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
