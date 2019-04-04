import React, { Component } from "react";
import LateralMenu from "../../lateralMenu";
import { injectIntl, FormattedMessage } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const items = [
  {
    href: "/admin/footage/:_id/public",
    label: (
      <FormattedMessage id="publicDataFootage" defaultMessage="Public data" />
    )
  },
  {
    href: "/admin/footage/:_id/video",
    label: <FormattedMessage id="videoVideos" defaultMessage="Video" />
  }
];

class MyLateralMenu extends Component {
  render() {
    const { _id } = this.props;

    return <LateralMenu items={items} _id={_id} />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

MyLateralMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLateralMenu);

export default injectIntl(MyLateralMenu);
