import React, { Component } from "react";
import { Button } from "react-bootstrap";
import ModelTable from "./table";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MODAL_ADD_VIDEOS } from "../modal/constants";
import { showModal } from "../modal/actions";

class Videos extends Component {
  render() {
    const { showModal, history } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <Button
                bsStyle="success"
                className="pull-right"
                onClick={() =>
                  showModal({
                    type: MODAL_ADD_VIDEOS,
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

Videos = connect(
  mapStateToProps,
  mapDispatchToProps
)(Videos);

export default Videos;
