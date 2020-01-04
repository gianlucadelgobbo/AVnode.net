import React, { Component } from "react";
import { Button } from "react-bootstrap";
import ModelTable from "./table";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MODAL_ADD_GALLERIES } from "../modal/constants";
import { showModal } from "../modal/actions";

class Galleries extends Component {
  render() {
    const { showModal, history } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row mt-3">
            <div className="col-md-10">
              <h3 className="labelField">GALLERIES</h3>
            </div>
            <div className="col-md-2">
              <Button
                bsStyle="success"
                className="float-right"
                onClick={() =>
                  showModal({
                    type: MODAL_ADD_GALLERIES,
                    props: { history }
                  })
                }
              >
                <i
                  className="fa fa-plus"
                  data-toggle="tooltip"
                  data-placement="top"
                />
              </Button>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-md-12">
              <ModelTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal
    },
    dispatch
  );

Galleries = connect(
  mapStateToProps,
  mapDispatchToProps
)(Galleries);

export default Galleries;
