import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Parser from "html-react-parser";

class ErrorMessage extends Component {
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  printError(message) {
    return (
      <div className="alert alert-danger" role="alert" dangerouslySetInnerHTML={{__html: message}}>
      </div>
    );
  }

  getNormalizedErrors(errorMessage) {
    const keys = Object.keys(errorMessage);
    let unionOfAllTheErrors = [];

    keys.forEach(k => {
      const fieldErrors = errorMessage[k];
      fieldErrors.forEach(f => {
        unionOfAllTheErrors = unionOfAllTheErrors.concat(f.err);
      });
    });

    return unionOfAllTheErrors;
  }

  render() {
    const { errorMessage } = this.props;

    const errorIsAnObj =
      typeof errorMessage === "object" && !!Object.keys(errorMessage).length;
    const firstErrorKey = !!errorIsAnObj && Object.keys(errorMessage)[0];
    const isMultipleError =
      !!errorIsAnObj &&
      !!firstErrorKey &&
      Array.isArray(errorMessage[firstErrorKey]);

    return (
      <div className="row">
        <div className="col-md-12">
          {!isMultipleError ? (
            this.printError(errorMessage)
          ) : (
            <ul className="list-unstyled">
              {this.getNormalizedErrors(errorMessage).map((e, index) => (
                <li key={index}>{this.printError(e)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

ErrorMessage = injectIntl(ErrorMessage);

export default ErrorMessage;
