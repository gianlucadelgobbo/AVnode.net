import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../../selectors";
import _ from "lodash";
import { showModal, hideModal } from "../../../modal/actions";
import { bindActionCreators } from "redux";
import { fetchModel, saveModel } from "../actions";
import { loadSuggestion, fetchCrewMembers } from "../../../../api";
import ErrorMessage from "../../../errorMessage";

class AddCrewMember extends Component {
  getOptionLabel = option => `${option.stagename}`;
  getOptionValue = option => `${option._id}`;
  getOptions = (query, callback) => {
    if (query && query.length >= 3) {
      this.setState({ disable: false });
      return loadSuggestion(query)
        .then(resp => callback(resp.data))
        .catch(error => callback(error, null));
    } else {
      return Promise.resolve([]);
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      disable: true
    };
  }

  createModelToSave(value, id) {
    //clone obj
    let model = {};

    model.idmember = value.members._id;

    model.label = value.members.stagename;

    model.id = id;

    return model;
  }

  handleSubmit(value) {
    const { id } = this.props;
    console.log(value);
    const { saveModel, hideModal } = this.props;
    const modelToSave = this.createModelToSave(value, id);
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        fetchCrewMembers({ id: id }).then(response => hideModal());
      }
    });
  }

  render() {
    const { showModal, errorMessage } = this.props;

    const { disable, optionSelect } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
          <Form
            onSubmit={this.handleSubmit.bind(this)}
            showModal={showModal}
            name="members"
            placeholder="Search a member"
            label="member"
            disable={disable}
            loadOptions={this.getOptions.bind(this)}
            getOptionValue={this.getOptionValue}
            getOptionLabel={this.getOptionLabel}
            onSelectResetsInput={false}
            onBlurResetsInput={false}
            value={optionSelect}
            noOptionsMessage="No options"
          />
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, { id }) => {
  return {
    model: getModel(state),
    errorMessage: getModelErrorMessage(state, id)
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      hideModal,
      saveModel,
      fetchModel
    },
    dispatch
  );

AddCrewMember = connect(mapStateToProps, mapDispatchToProps)(AddCrewMember);

export default AddCrewMember;
