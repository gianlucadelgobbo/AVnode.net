import React, { Component } from "react";
import LateralMenu from "../../lateralMenu";
import { FormattedMessage, injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const items = [
  {
    href: "/admin/profile/:_id/public",
    label: (
      <FormattedMessage id="publicDataProfile" defaultMessage="Public data" />
    )
  },
  {
    href: "/admin/profile/:_id/images",
    label: <FormattedMessage id="imagesProfile" defaultMessage="Image" />
  },
  {
    href: "/admin/profile/:_id/emails",
    label: <FormattedMessage id="emailsProfile" defaultMessage="Emails" />
  },
  {
    href: "/admin/profile/:_id/private",
    label: (
      <FormattedMessage id="privateDataProfile" defaultMessage="Private data" />
    )
  },
  {
    href: "/admin/profile/:_id/password",
    label: <FormattedMessage id="passwordProfile" defaultMessage="Password" />
  } /* ,
    {
        href: "/admin/profile/connections",
        label: <FormattedMessage
            id="connectionsProfile"
            defaultMessage="Connections"
        />


    }, */
];

class MyLateralMenu extends Component {
  render() {
    const { _id } = this.props;
    return <LateralMenu items={items} _id={_id} />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

MyLateralMenu = connect(mapStateToProps, mapDispatchToProps)(MyLateralMenu);

export default injectIntl(MyLateralMenu);
