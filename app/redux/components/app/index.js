import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { fetchModel as fetchUser } from "../user/actions";
import { getDefaultModel } from "../user/selectors";
import MainSignUp from "../signup/route/index";

import MainApp from "../main/index";

class App extends Component {
  componentDidMount() {
    const { fetchUser } = this.props;
    fetchUser();
  }
  render() {
    const { user } = this.props;
    console.log(user);
    const location = window.location.pathname;
    return (
      <div>
        {location.indexOf("/signup") === 0 ? (
          <MainSignUp />
        ) : (
          <MainApp user={user} />
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: getDefaultModel(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUser
    },
    dispatch
  );

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default injectIntl(App);
