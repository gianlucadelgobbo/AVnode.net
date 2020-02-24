import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { getModel, getModelErrorMessage } from "../selectors";
import { showModal, hideModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
//import { MODAL_SAVED } from "../../modal/constants";
import { saveModel } from "./actions";
import { fetchModel } from "../public/actions";
//import { fetchList as fetchUsers } from "./actions";
import { getList as getUsers } from "./selectors";
import { loadSuggestionAuthors, fetchPerformancePublic } from "../../../api";
import ErrorMessage from "../../errorMessage";

class AddUsersFootage extends Component {
  getOptionLabel = option => `${option.stagename}`;
  getOptionValue = option => `${option._id}`;
  getOptions = (query, callback) => {
    if (query && query.length >= 3) {
      this.setState({ disable: false });
      return loadSuggestionAuthors(query)
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

  componentDidMount() {}

  // Convert form values to API model
  createModelToSave(value, _id) {
    //clone obj
    let model = {};

    model.idusers = value.users._id;

    model.label = value.users.stagename;

    model._id = _id;

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};

    return v;
  }

  handleSubmit(value) {
    const { _id } = this.props;
    const { saveModel, hideModal } = this.props;
    const modelToSave = this.createModelToSave(value, _id);
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        fetchPerformancePublic({ id: _id }).then(response => hideModal());
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
            name="users"
            placeholder="Search a user"
            label="User"
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
const mapStateToProps = (state, { _id }) => ({
  model: getModel(state),
  users: getUsers(state),
  errorMessage: getModelErrorMessage(state, _id)
});

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

AddUsersFootage = connect(mapStateToProps, mapDispatchToProps)(AddUsersFootage);

export default AddUsersFootage;
