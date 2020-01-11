import React from "react";

const lazyComponent = (importComponent, extraProps = {}) => {
  class AsyncComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        Component: null
      };
    }

    async componentDidMount() {
      const { default: Component } = await importComponent();

      this.setState({
        Component
      });
    }

    render() {
      const { Component } = this.state;

      return Component ? <Component {...this.props} {...extraProps} /> : null;
    }
  }

  return AsyncComponent;
};

export default lazyComponent;
