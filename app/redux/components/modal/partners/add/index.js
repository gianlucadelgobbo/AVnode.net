import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchList as fetchCategories} from "../../../categories/actions";
import {getList as getCategories} from "../../../categories/selectors";
import Form from './form'
import {MODAL_SAVED} from "../../constants";

class AddPartnerModal extends Component {

    componentDidMount() {
        const {fetchCategories} = this.props;
        fetchCategories();
    }


    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    onSubmit(values) {
        const {showModal, onSubmit, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return onSubmit(model)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }


    render() {

        const {categories, hideCategory} = this.props;

        return (
            <Form
                hideCategory={hideCategory}
                categories={categories}
                onSubmit={this.onSubmit.bind(this)}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    categories: getCategories(state).map(c => ({label: c.name, value: c._id})),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchCategories
}, dispatch);

AddPartnerModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPartnerModal);

export default AddPartnerModal;
