import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {getModel, getIsFetching, getErrorMessage} from "../selectors";
import {connect} from "react-redux";
import {showModal} from "../../modal/actions";
import {fetchModel, removeModel} from "./actions";
import {Button} from 'react-bootstrap';
import {MODAL_ADD_MEMBERS, MODAL_SAVED, MODAL_REMOVE} from "../../modal/constants";
import Loading from '../../loading';
import Table from '../../table';
import {injectIntl, FormattedMessage} from 'react-intl';
import LateralMenu from '../lateralMenu';

class MembersTable extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}} = this.props;
        fetchModel({
            id: _id
        });
    }


    onAddModel(values) {
        const {showModal, addModel, model} = this.props;
        const modelToSave = this.createAddModelToSave(values);

        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return addModel(model)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }


    renderTable() {

        const {showModal, removeModel,  list: {members} } = this.props;
        
        const MemberItem = 
                        {
                            label: <FormattedMessage
                                    id="MembersTitle"
                                    defaultMessage="Name"
                                    />
                        }
        return <Table
            data={members}
            columns={
                [
                
                    {
                        Header: () => {
                            return <span>{MemberItem.label}<i className="fa fa-sort"></i></span>
                        },
                        id: "stagename",
                        accessor: 'stagename',
                        className:'MembersTable',
                        Cell: (props) => {
                            const {row} = props;
                            return  <div className="memberTitle">
                                        <p>{row.stagename}</p>
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

        const {list, showModal,  match: {params: {_id}}, isFetching, errorMessage} = this.props;

        return (

        <div>
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                    _id={_id}
                    />
                </div>
                <div className="col-md-10">
                
                <div className="row marginBottom">
                    <div className="col-md-6">
                        <h2 className="labelField">
                            <FormattedMessage
                                id="Members"
                                defaultMessage="Members"
                            />
                        </h2>
                    </div>
                    <div className="col-md-6">
                        <Button
                            bsStyle="success"
                            className="pull-right"
                            onClick={() => showModal({
                                type: MODAL_ADD_MEMBERS
                            })}>
                            <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {/*!list.length && <div>No Crew to display</div>*/}

                        {isFetching && <Loading/>}

                        {errorMessage && <div>{errorMessage}</div>}

                        {list && this.renderTable()}
                    </div>
                </div>

                </div>
            </div>

            <br/>

        </div>

        );
    }
}

const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    list: getModel(state, _id),
    isFetching: getIsFetching(state, _id),
    errorMessage: getErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    fetchModel,
    removeModel
}, dispatch);

MembersTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(MembersTable);

export default injectIntl(MembersTable);
