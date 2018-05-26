import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {showModal} from "../modal/actions";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {MODAL_REMOVE} from "../modal/constants";
import Loading from '../loading/index'
import Table from '../table/index'

class ModelTable extends Component {

    normalizeData() {

        const {list = []} = this.props;
        let result = [];

        list.forEach(item => {
            let {users, category} = item;
            users.forEach( u => {
                u.category= category;
                result.push(u)
            })

        });

        return result;

    }


    renderTable() {

        const {showModal, removeModel} = this.props;

        const data = this.normalizeData();

        return <Table
            data={data}
            columns={
                [
                    {
                        Header: "Partner",
                        id: "Partner",
                        accessor: 'title',
                        Cell: (props) => {
                            const {row, original} = props;
                            return <div >
                                {original.stagename}
                            </div>
                        }
                    },
                    {
                        Header: "Category",
                        accessor: 'category.name',
                        Cell: (props) => {
                            const { original} = props;
                            return <div >
                                {original.category.name}
                            </div>
                        }
                    },
                    {
                        Header: "Actions",
                        id: "actions",
                        width: 100,
                        Cell: (props) => {
                            const {original} = props;
                            return <Button
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
                            </Button>
                        }

                    }
                ]
            }
        />

    }

    render() {

        const {list = [], isFetching, errorMessage} = this.props;

        return (
            <div>
                {!list.length && <div>No Partners to display</div>}

                {isFetching && <Loading/>}

                {errorMessage && <div>{errorMessage}</div>}

                {list && this.renderTable()}

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

export default ModelTable;
