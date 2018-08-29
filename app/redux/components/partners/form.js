import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {showModal} from "../modal/actions";
import {Button} from 'react-bootstrap';
import {MODAL_REMOVE} from "../modal/constants";
import Table from '../table/index'
import {reduxForm, FieldArray, Field} from "redux-form";
import {renderList} from "../common/form/components";
import {FORM_NAME} from "./constants";
import validate from "./validate";
import {injectIntl} from 'react-intl';
import {NAME, CATEGORY, ACTION} from "../common/form/labels";

class ModelTable extends Component {

    getIntlString = (obj) => {
        const {intl} = this.props;
        return intl.formatMessage(obj)
    };

    getColumns(fields) {
        const {showModal, removeModel, categories, hideCategory} = this.props;
        let columns = [];
        let nameColumn = {
            Header: this.getIntlString({id:NAME}),
            id: "name",
            accessor: 'stagename',
            Cell: (props) => {
                const {original} = props;
                return <div>
                    {original.stagename}
                </div>
            }
        };
        let categoryColumn = {
            Header: this.getIntlString({id:CATEGORY}),
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
        };
        let actionColumn = {
            Header: this.getIntlString({id:ACTION}),
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

        };

        columns.push(nameColumn);

        if (!hideCategory) {
            columns.push(categoryColumn);
        }
        columns.push(actionColumn);

        return columns
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

    render() {

        const {
            submitting,
            handleSubmit
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
        </form>);
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

ModelTable = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate
})(ModelTable);

ModelTable = injectIntl(ModelTable);

export default ModelTable;