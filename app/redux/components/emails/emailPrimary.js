import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const emailPrimary = injectIntl(({ input, label, type, meta: { touched, error }, intl }) => (
  <div>
    {/*console.log('emailPrivacy:' + JSON.stringify(input) + input.value)*/}
    {input.value ?
      <span className="badge badge-primary">
        <FormattedMessage
          id="primary"
          defaultMessage="Primary"
        />
      </span>
      :
      <button
        type="button"
        className="btn btn-secondary btn-sm"
      //onClick={onMakePrimary}
      >
        <i
          className="fa fa-star"
          data-toggle="tooltip"
          data-placement="top"
          title={intl.formatMessage({
            id: 'makeitprimary',
            defaultMessage: 'Make it primary'
          })}
        >
        </i>
      </button>
    }
  </div>
));

export default emailPrimary;
