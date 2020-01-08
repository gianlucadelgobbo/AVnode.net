import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { getModel, getIsFetching, getErrorMessage } from "../selectors";
import { connect } from "react-redux";
import { showModal } from "../../modal/actions";
import { fetchModel, removeModel } from "./actions";
import { Button } from "react-bootstrap";
import {
  MODAL_ADD_MEMBERS,
  MODAL_SAVED,
  MODAL_REMOVE
} from "../../modal/constants";
import Loading from "../../loading";
import Table from "../../table";
import { injectIntl, FormattedMessage } from "react-intl";
import LateralMenu from "../lateralMenu";
import { ACTION, ERROR_MEMBERS_TO_DISPLAY } from "../../common/form/labels";
import ErrorMessage from "../../errorMessage";
import TitleComponent from "../../titleComponent";
import { CREW_NAME, SHOW } from "./constants";

class MembersTable extends Component {
  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      }
    } = this.props;
    //console.log(_id);
    fetchModel({
      id: _id
    });
  }

  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };
  /*
  onAddModel(values) {
    const { showModal, addModel, model } = this.props;
    const modelToSave = this.createAddModelToSave(values);

    modelToSave._id = model._id;

    //dispatch the action to save the model here
    return addModel(model).then(() => {
      showModal({
        type: MODAL_SAVED
      });
    });
  }
  */
  renderTable() {
    const {
      showModal,
      removeModel,
      list = {},
      match: {
        params: { _id }
      }
    } = this.props;
    const { members = [] } = list;

    const MemberItem = {
      label: <FormattedMessage id="MembersTitle" defaultMessage="Name" />
    };
    return (
      <Table
        data={members}
        columns={[
          {
            Header: () => {
              return (
                <span>
                  {MemberItem.label}
                  <i className="fa fa-sort" />
                </span>
              );
            },
            id: "stagename",
            accessor: "stagename",
            className: "MembersTable",
            Cell: props => {
              const { row } = props;
              return (
                <div className="memberTitle">
                  <p>{row.stagename}</p>
                </div>
              );
            }
          },
          {
            Header: this.getIntlString({ id: ACTION }),
            id: "actions",
            width: 100,
            Cell: props => {
              const { original } = props;
              let model = { idmember: original._id, id: _id };
              return (
                <Button
                  bsStyle="danger"
                  className="btn-block"
                  onClick={() =>
                    showModal({
                      type: MODAL_REMOVE,
                      props: {
                        onRemove: () => removeModel(model)
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
              );
            }
          }
        ]}
      />
    );
  }

  render() {
    const {
      model = {},
      list = [],
      showModal,
      match: {
        params: { _id }
      },
      isFetching,
      errorMessage
    } = this.props;
    //console.log(errorMessage);
    return (
          <div>
            <TitleComponent
              title={model.stagename}
              link={"/" + model.slug}
              show={SHOW}
            />
            <LateralMenu _id={_id} />
            <hr />
            <h3 className="labelField mb-3">{CREW_NAME}</h3>
            <div className="row marginBottom">
              <div className="col-md-6">
                <h2 className="labelField">
                  <FormattedMessage id="Members" defaultMessage="Members" />
                </h2>
              </div>
              <div className="col-md-6">
                <Button
                  bsStyle="success"
                  className="float-right"
                  onClick={() =>
                    showModal({
                      type: MODAL_ADD_MEMBERS,
                      props: { _id }
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
            <div className="row">
              <div className="col-md-12">
                {/*!list.length && <div>{ERROR_MEMBERS_TO_DISPLAY}</div>*/}

                {isFetching && <Loading />}

                {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

                {list && this.renderTable()}
              </div>
            </div>
          </div>
    );
  }
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { _id }
    }
  }
) => ({
  model: getModel(state, _id),
  list: getModel(state, _id),
  isFetching: getIsFetching(state, _id),
  errorMessage: getErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      fetchModel,
      removeModel
    },
    dispatch
  );

MembersTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersTable);

export default injectIntl(MembersTable);
