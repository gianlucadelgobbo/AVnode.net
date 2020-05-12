import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter'

class Table extends Component {

    render() {

        const {data, columns, defaultPageSize= 10} = this.props;

        return (
            <ReactTable
                data={data}
                filterable
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value}
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
