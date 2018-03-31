import {h, Component} from 'preact';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";

class Table extends Component {

    render() {

        const {data, columns, defaultPageSize= 10} = this.props;

        return (
            <ReactTable
                data={data}
                columns={ columns  }
                defaultPageSize={defaultPageSize}
                className="-striped -highlight"
            />
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

Table = connect(
    mapStateToProps,
    mapDispatchToProps
)(Table);

export default Table;
