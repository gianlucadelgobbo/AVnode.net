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
    const PlaylistItem = {
      label: (
        <FormattedMessage id="PlaylistItem" defaultMessage="Playlist Name" />
      )
    };
    return (
      <Table
        data={list}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {PlaylistItem.label}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "title",
            accessor: "title",
            className: "PlaylistTable",
            Cell: props => {
              const { row, original } = props;
              return (
                <Link to={`/admin/playlists/${original._id}/public`}>
                  <img
                    height={140}
                    className="image-responsive"
                    src={
                      original.imageFormats !== undefined
                        ? original.imageFormats.small
                        : ""
                    }
                  />
                  <p>{row.title}</p>
                </Link>
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
