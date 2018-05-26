import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {showModal} from "../modal/actions";
import {Button} from 'react-bootstrap';
import {MODAL_REMOVE} from "../modal/constants";
import Loading from '../loading/index'
import Table from '../table/index'
import {reduxForm, FieldArray, Field} from "redux-form";
import {renderList} from "../common/form/components";
import {FORM_NAME} from "./constants";
import validate from "./validate";

class ModelTable extends Component {

    getColumns(fields) {
        const {showModal, removeModel, categories} = this.props;

        return [
            {
                Header: "Partner",
                id: "Partner",
                accessor: 'title',
                Cell: (props) => {
                    const {original} = props;
                    return <div>
                        {original.stagename}
                    </div>
                }
            },
            {
                Header: "Category",
                accessor: 'category.name',
                Cell: (props) => {
                    const {index} = props;
                    return <div>

                        {fields.get(index) && <Field
                            name={`partners[${index}].category`}
                            component={renderList}
                            options={categories}
                            clearable={false}
                        />}

                    </div>
                }
            },
            {
                Header: "Actions",
                id: "actions",
                width: 100,
                Cell: (props) => {
                    const {original, index} = props;
                    return <div>
                        {fields.get(index) && <Button
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
                        </Button>}
                    </div>
                }

            }
        ]
    }

    renderTable({fields}) {
        const {data} = this.props;

        return (<Table
            data={data}
            columns={this.getColumns(fields)}
        />)

    }

    onSubmit(values) {
        console.log(values)
    }

    renderForm() {

        const {
            submitting,
            handleSubmit,
        } = this.props;

        return (<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>

            <FieldArray
                name="partners"
                component={this.renderTable.bind(this)}
            />

            <hr/>

            <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg btn-block">
                {submitting ? "Saving..." : "Save"}
            </button>
        </form>)

    }

    render() {

        const {list = [], isFetching, errorMessage} = this.props;

        return (
            <div>
                {!list.length && <div>No Partners to display</div>}

                {isFetching && <Loading/>}

                {errorMessage && <div>{errorMessage}</div>}

                {list && this.renderForm()}

            </div>

        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
}, dispatch);

ModelTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModelTable);

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses[]']
})(ModelTable);
