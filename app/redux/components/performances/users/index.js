import React, { Component } from 'react';
import Form from './form'
import {connect} from 'react-redux'
import {getModel, getModelErrorMessage} from '../selectors'
import {showModal, hideModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import {fetchModel, saveModel} from './actions';
import {fetchList as fetchUsers} from "./actions";
import {getList as getUsers} from "./selectors";
import { loadSuggestion } from "../../../api";
import ErrorMessage from "../../errorMessage";


const getSuggestionValue = suggestion => suggestion.stagename;

const getSuggestionID = suggestion => suggestion.id;

const renderSuggestion = suggestion => (
  <div id={suggestion.id}>{suggestion.stagename}</div>
);


class AddUsersPerformance extends Component {

    constructor(props) {
        super(props);
        this.state = {
          value: "",
          idusers: "",
          suggestions: []
        };
      }

    componentDidMount() {
        //const {fetchUsers} = this.props;
        //fetchUsers();
    }

    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue,
          idusers: event.target.id
        });
      };

    onSuggestionsFetchRequested = ({ value }) => {
        if (value.length >= 3) {
        return loadSuggestion({ value }).then(response =>
            this.setState({ suggestions: response.data })
        );
        }
    };
    
    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };

    // Convert form values to API model
    createModelToSave(idmember, id) {
        //clone obj
        let model = {};
    
        model.idusers = idusers;
    
        model.id = id;
    
        return model;
      }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        return v;
    }

    onSubmitForm(idusers) {
        const { id } = this.props;
        const { fetchModel, saveModel, hideModal } = this.props;
        const modelToSave = this.createModelToSave(idusers, id);
        return saveModel(modelToSave).then(model => {
          if (model && model.id) {
            fetchModel({ id: id });
            hideModal();
          }
        });
      }

    /*onSubmit(values) {
        const {showModal} = this.props;
        const modelToSave = this.createModelToSave(values);

        //dispatch the action to save the model here
        return saveModel(modelToSave)()
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }*/

    render() {

        const {showModal, errorMessage} = this.props;

        const { value, suggestions, idusers } = this.state;

        const inputProps = {
        className: "form-control",
        placeholder: "Type a users",
        value,
        idusers,
        onChange: this.onChange
        };


        return (

            <div className="row">
                <div className="col-md-12">
                {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
                 <Form
                    onSubmitForm={this.onSubmitForm.bind(this)}
                    showModal={showModal}
                    name="users"
                    inputProps={inputProps}
                    suggestions={suggestions}
                    placeholder="Users"
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(
                    this
                    )}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(
                    this
                    )}
                    getSuggestionValue={getSuggestionValue}
                    getSuggestionID={getSuggestionID}
                    renderSuggestion={renderSuggestion}
                />
                    
                </div>
            </div>

        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state,  { _id }) => ({
    model: getModel(state),
    users: getUsers(state),
    errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    hideModal,
    saveModel,
    fetchModel
}, dispatch);

AddUsersPerformance = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddUsersPerformance);

export default AddUsersPerformance;
