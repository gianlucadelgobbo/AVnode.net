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
import { ACTION, ERROR_CREW_TO_DISPLAY } from "../../common/form/labels";

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
    const CrewItem = {
      label_0: <FormattedMessage id="CrewTitleTitle" defaultMessage="Image" />,
      label_1: <FormattedMessage id="CrewNameTitle" defaultMessage="Name" />,
      label_2: <FormattedMessage id="CrewType" defaultMessage="Type" />,
      label_3: <FormattedMessage id="CrewMembersTitle" defaultMessage="Members" />,
      label_4: <FormattedMessage id="CrewCreationDateTitle" defaultMessage="Date" />,
      label_5: <FormattedMessage id="CrewLinks" defaultMessage="Links" />
    };

    return (
      <Table
        data={list}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {CrewItem.label_0}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "CrewImg",
            className: "CrewImg",
            accessor: "CrewImg",
            maxWidth: 200,
            Cell: props => {
              const { row, original } = props;
              return (
                <Link to={`/admin/crews/${original._id}/public`}>
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
                  {CrewItem.label_1}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "CrewTitle",
            className: "CrewTitle",
            accessor: original => original.stagename,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  <div><b><Link to={`/admin/crews/${original._id}/public`}> <i className="fa fa-edit" /> </Link> | <Link onClick={this.forceUpdate} to={`/crews/${original.slug}/`}> <i className="fa fa-eye" /> </Link> | {original.stagename}</b></div>
                  <div>{original.is_public===true ? <i className="fas fa-circle text-success" /> : <i className="far fa-circle text-danger" />} Public</div>
                  <div><i className="fa fa-eye" /> {original.stats.visits}</div>
                </div>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {CrewItem.label_2}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "CrewType",
            className: "CrewType",
            accessor:  original => (original.partner_owner && original.partner_owner.length && original.partner_owner.map(item => {return item.owner.toString()}).indexOf("5be8772bfc39610000007065") !== -1)  || original.activity_as_organization > 0 ? "ORGANIZATION" : "CREW",
            width: 150,
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                (original.partner_owner && original.partner_owner.length && original.partner_owner.map(item => {return item.owner.toString()}).indexOf("5be8772bfc39610000007065") !== -1)  || original.activity_as_organization > 0 ? "ORGANIZATION" : "CREW"
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {CrewItem.label_3}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "CrewMembers",
            className: "CrewMembers",
            accessor: original => original.members && original.members.length ? original.members.map( item =>{return item.stagename}).join(", ") : "MISSING USERS",
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <ul>
                  {original.members.map((user, i) => (
                    <li key={i}>{user.stagename}</li>
                  ))}
                </ul>
              );
            }
          },{
            Header: () => {
              return (
                <span>
                  {CrewItem.label_4}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "CrewDate",
            className: "CrewDate",
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
                  {CrewItem.label_5}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "CrewLinks",
            className: "CrewLinks",
            accessor: original => Object.keys(original.stats).join(", "),
            filterMethod: (filter, rows) => {
              return rows[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())!==-1 ? true : false
            },
            Cell: props => {
              const { row, original } = props;
              return (
                <div>
                  <ul className="compactList">
                    {Object.keys(original.stats).map((k, i) => (
                      k != "visits" && k != "members" ?  
                        <li key={i}>{k}: { 
                          k == "recent" ?  <ul>
                            {Object.keys(original.stats[k]).map((key2, i) =>(
                            <li key={i}>{key2}: {original.stats[k][key2]}</li>
                          ))}</ul> : original.stats[k]}</li>
                      : ""
                    ))}
                  </ul>
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
    console.log(list);
    return (
      <div>
        {!list.length && <div>{<FormattedMessage
                                id="label.error.crew.to.display"
                                defaultMessage="No Crew to display"
                            />}</div>}

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
