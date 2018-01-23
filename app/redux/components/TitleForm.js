import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';

const TitleForm = injectIntl(({ ajaxInProgress, dispatch, action, label, placeholder, intl }) => {
  let input;
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return;
        }
        dispatch(action(input.value));
        input.value = '';
      }}>
        <label>
          <FormattedMessage
            id="name"
            defaultMessage="Name"
          />
        </label>
        <div className="input-group">
          <input
            className="form-control form-control-lg"
            placeholder={placeholder}
            ref={node => {
              input = node;
            }}
          />
          {ajaxInProgress ?
            <button type="button" className="input-group-addon disabled">
              <FormattedMessage
                id="pleaseWait"
                defaultMessage="Please wait…"
              />

            </button> :
            <button type="submit" className="input-group-addon">
              {label}
            </button>
          }
        </div>
      </form>
    </div>
  );
});

export default connect()(TitleForm);
