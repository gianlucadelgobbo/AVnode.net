import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {getList, getIsFetching, getErrorMessage} from "../selectors";
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import {connect} from "react-redux";
import {showModal} from "../../modal/actions";
import {fetchModel, removeModel} from "./actions";
import {Button} from 'react-bootstrap';
import {MODAL_REMOVE} from "../../modal/constants";
import Loading from '../../loading';
import Table from '../../table';
import {injectIntl, FormattedMessage} from 'react-intl';

class MembersTable extends Component {

    componentDidMount() {
        const {fetchModel, match: {params: {_id}}} = this.props;
        fetchModel({
            id: _id
        });
    }

    normalizeData(list){  
        
    if (!list || !Array.isArray(list)) {
        return [];
    }

    let result = [];

    list.forEach(item => {
        let {members} = item;
        members.forEach(m => {
            result.push(m)
        })

    });

    return result;
        
    };

    renderTable() {

        const {showModal, removeModel, list} = this.props;

        const listMembers = this.normalizeData(list);

        console.log(listMembers);
        
        const MemberItem = 
                        {
                            label: <FormattedMessage
                                    id="MembersTitle"
                                    defaultMessage="Members Name"
                                    />
                        }
        return <Table
            data={listMembers}
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
                            const {row, original} = props;
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

        const {list, isFetching, errorMessage} = this.props;

        return (
            <div>
                {!list.length && <div>No Crew to display</div>}

                {isFetching && <Loading/>}

                {errorMessage && <div>{errorMessage}</div>}

                {list && this.renderTable()}

            </div>

        );
    }
}

const mapStateToProps = (state, {match: {params: {_id}}}) => ({
    list: getList(state, _id),
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
