import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchList as fetchCategories} from "../../../categories/actions";
import {getList as getCategories} from "../../../categories/selectors";
import Form from './form'

class AddPartnerModal extends Component {

    componentDidMount() {
        const {fetchCategories} = this.props;
        fetchCategories();
    }

    render() {

        const {categories} = this.props;

        return (
            <Form
                categories={categories}
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
