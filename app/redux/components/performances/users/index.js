import React, { Component } from 'react';
import Form from './form'
import {connect} from 'react-redux'
import {getModel} from '../selectors'
import {showModal} from "../../modal/actions";
import {bindActionCreators} from "redux";
import {MODAL_SAVED} from "../../modal/constants";
import {saveModel} from './actions';
import {fetchList as fetchUsers} from "./actions";
import {getList as getUsers} from "./selectors";


class AddUsersPerformance extends Component {

    componentDidMount() {
        const {fetchUsers} = this.props;
        fetchUsers();
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

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

    onSubmit(values) {
        const {showModal} = this.props;
        const modelToSave = this.createModelToSave(values);

        //dispatch the action to save the model here
        return saveModel(modelToSave)();
            /*.then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });*/
    }

    render() {

        const {showModal, users} = this.props;

        return (

            <div className="row">
                <div className="col-md-12">
                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        showModal={showModal}
                        users={users}
                    />
                </div>
            </div>

        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getModel(state),
    users: getUsers(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    //saveModel,
    fetchUsers
}, dispatch);

AddUsersPerformance = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddUsersPerformance);

export default AddUsersPerformance;
