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
import matchSorter from 'match-sorter'

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
    const EventItem = {
      label_0: <FormattedMessage id="EventTitleTitle" defaultMessage="Image" />,
      label_1: <FormattedMessage id="EventNameTitle" defaultMessage="Name" />,
      label_2: <FormattedMessage id="EventStartDateTitle" defaultMessage="Start Date" />,
      label_3: <FormattedMessage id="EventProductionTitle" defaultMessage="Productions" />,
      label_4: <FormattedMessage id="EventCreationDateTitle" defaultMessage="Date" />,
    };

    return (
      <Table
        data={list}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {EventItem.label_0}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "EventImg",
            className: "EventImg",
            accessor: "EventImg",
            maxWidth: 200,
            Cell: props => {
              const { row, original } = props;
              return (
                <Link to={`/admin/events/${original._id}/public`}>
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
                  {EventItem.label_1}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "EventTitle",
            className: "EventTitle",
            accessor: original => original.title,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  <div><b><Link to={`/admin/events/${original._id}/public`}> <i className="fa fa-edit" /> </Link> | <Link to={`/events/${original.slug}/`}> <i className="fa fa-eye" /> </Link> | {original.title}</b></div>
                  <div>{original.is_public===true ? <i className="fas fa-circle text-success" /> : <i className="far fa-circle text-danger" />} Public</div>
                  <div><i className="fa fa-heart" /> {original.stats.likes} | <i className="fa fa-eye" /> {original.stats.visits}</div>
                </div>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {EventItem.label_2}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "EventStartDate",
            className: "EventStartDate",
            accessor: original => original.schedule && original.schedule.length ? original.schedule[0].starttime : "MISSING SCHEDULE",
            width: 100,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>{original.schedule && original.schedule.length ? 
                  new Date(original.schedule[0].starttime).toLocaleDateString() :
                  "MISSING"
                }</div>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {EventItem.label_3}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "EventProduction",
            className: "EventProduction",
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
                  {EventItem.label_4}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "EventDate",
            className: "EventDate",
            width: 100,
            accessor: original => original.createdAt,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>{new Date(original.createdAt).toLocaleDateString()}<br />{new Date(original.updatedAt).toLocaleDateString()}</div>
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
        {!list.length && <div>No events to display</div>}

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
