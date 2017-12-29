import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const emailPrivacy = injectIntl(({ input, label, type, meta: { touched, error }, intl }) => (
  <div>
    {console.log('emailPrivacy:' + JSON.stringify(input) + input.value)}
    {input.value ?
      <button
        type="button"
        className="btn btn-success btn-sm"
      //onClick={onMakePrivate}
      >
        <i
          className="fa fa-exchange"
          data-toggle="tooltip"
          data-placement="top"
          title={intl.formatMessage({
            id: 'makeitprivate',
            defaultMessage: 'Make it private'
          })}
        >
        </i>
      </button>
      :
      <button
        type="button"
        className="btn btn-warning btn-sm"
      //onClick={onMakePublic}
      >
        <i
          className="fa fa-shield"
          data-toggle="tooltip"
          data-placement="top"
          title={intl.formatMessage({
            id: 'makeitpublic',
            defaultMessage: 'Make it public'
          })}
        >
        </i>
      </button>
    }
  </div>
));

export default emailPrivacy;
