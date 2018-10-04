import React, {Component} from 'react';
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants';
import {autocompleteComponent} from "../../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';
import {saveModel} from "../../../crews/members/actions";

const members = [
    {
        name: 'John',
        year: 1972
    },
    {
        name: 'Daniele',
        year: 2012
    },
    {
        name: 'Marco',
        year: 1972
    },
    {
        name: 'Luca',
        year: 2012
    }
  ];

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : members.filter(member =>
        member.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };
  
  const getSuggestionValue = suggestion => suggestion.name;
  
  const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  )

class AddMembersForm extends Component {

    constructor() {
        super();
        this.state = {
          value: '',
          suggestions: []
        };
      }
    
      
    onChange = (event, { newValue }) => {
        this.setState({
        value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
        suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };

    createModelToSave(values){
         //clone obj
         let model = Object.assign({}, values);

         model = model.members;

         return model;
    }

    submitForm(values) {
        const {saveModel} = this.props;
        const modelToSave = this.createModelToSave(values);
        return saveModel(modelToSave)
        .then((model) => {
            if(model && model.id){
                showModal({
                    type: MODAL_SAVED
                });
            }
        });

       
    }

    

    render() {

        const {
            submitting,
            handleSubmit
        } = this.props;

        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Type a members',
            value,
            onChange: this.onChange
          };
      

        return (
            <form onSubmit={handleSubmit(this.submitForm.bind(this))}>

                <Field
                    name="members"
                    component={autocompleteComponent}
                    inputProps={inputProps}
                    suggestions ={ suggestions }
                    placeholder="Members"
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                />

                <hr/>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg btn-block">
                    {submitting ? "Saving..." : "Save"}
                </button>

            </form>
        );
    }

}


//Get form's initial values from redux state here
const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({saveModel}, dispatch);

AddMembersForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddMembersForm);

AddMembersForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(AddMembersForm);

export default AddMembersForm;
