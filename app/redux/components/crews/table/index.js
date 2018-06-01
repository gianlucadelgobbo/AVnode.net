import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {getList, getIsFetching, getErrorMessage} from "../selectors";
import {connect} from "react-redux";
import {showModal} from "../../modal/actions";
import {fetchList, removeModel} from "../actions";
import {Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {MODAL_REMOVE} from "../../modal/constants";
import Loading from '../../loading';
import Table from '../../table';
import {injectIntl, FormattedMessage} from 'react-intl';

class ModelTable extends Component {

    componentDidMount() {
        const {fetchList} = this.props;
        fetchList();
    }

    renderTable() {

        const {showModal, removeModel, list} = this.props;
        const CrewItem = 
                        {
                            label: <FormattedMessage
                                    id="CrewTitle"
                                    defaultMessage="Crew Name"
                                    />
                        }
        return <Table
            data={list}
            columns={
                [
                
                    {
                        Header: () => {
                            return <span>{CrewItem.label}<i className="fa fa-sort"></i></span>
                        },
                        id: "stagename",
                        accessor: 'stagename',
                        className:'CrewTable',
                        Cell: (props) => {
                            const {row, original} = props;
                            return <Link to={`/admin/crews/${original._id}/public`}>
                                        <img src={original.imageFormats.small}/>
                                        <p>{row.stagename}</p>
                                    </Link>
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

const mapStateToProps = (state) => ({
    list: getList(state),
    isFetching: getIsFetching(state),
    errorMessage: getErrorMessage(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    showModal,
    fetchList,
    removeModel
}, dispatch);

ModelTable = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModelTable);

export default injectIntl(ModelTable);
