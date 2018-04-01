import {h, Component} from 'preact';
import {bindActionCreators} from "redux";
import {getList, getIsFetching, getErrorMessage} from "../selectors";
import {connect} from "preact-redux";
import {showModal} from "../../modal/actions";
import {fetchList, removeModel} from "../actions";
import {Button} from 'react-bootstrap';
import {Link} from 'preact-router/match';
import {MODAL_REMOVE} from "../../modal/constants";
import Loading from '../../loading'
import Table from '../../table'

class ModelTable extends Component {

    componentDidMount() {
        const {fetchList} = this.props;
        fetchList();
    }

    renderTable() {

        const {showModal, removeModel, list} = this.props;

        return <Table
            data={list}
            columns={
                [
                    {
                        Header: "Title",
                        id: "title",
                        accessor: 'title',
                        Cell: (props) => {
                            const {row, original} = props;
                            return <Link href={`/admin/performances/${original._id}/public`}>
                                {row.title}
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
                {!list.length && <div>No PERFORMANCES to display</div>}

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

export default ModelTable;
