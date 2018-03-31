import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import LinkTel from '../link/LinkTel';
import PhoneLinkTypes from '../link/PhoneLinkTypes';

const ProfileLinksPhoneForm = injectIntl(({
  user,
  intl,
  userLinkDelete
  }) => {

  const onLinkDelete = (link) => (e) => {
    return userLinkDelete(user._id, link._id);
  };
  return (
    <fieldset className="form-group">
      <legend>
        <FormattedMessage
          id="phoneNumbers"
          defaultMessage="Phone Numbers"
        />
      </legend>

      <label htmlFor="linkTel">
        <FormattedMessage
          id="number"
          defaultMessage="Number"
        />
      </label>

      <div className="input-group">
        <div className="input-group">
          <Field
            className="form-control"
            name="linkTel"
            component="input"
            placeholder={intl.formatMessage({
              id: 'addNumber',
              defaultMessage: 'Add/edit number'
            })}
          />
        </div>

        <div className="input-group-addon">

          {PhoneLinkTypes ?
            <Field
              className="form-control custom-select"
              name="linkType"
              component="select"
              value={user.linkType}
            >
              {PhoneLinkTypes.map((c) => (
                <option value={c.key.toLowerCase()}>{c.name}</option>
              ))
              }
            </Field> :
            <p>Loading link types…</p>
          }
        </div>
        <div className="input-group-addon">
          <button
            className="btn btn-success btn-sm"
            type="submit"
          >
            <i className="fa fa-link"></i>
          </button>
        </div>
      </div>

      <label>
        <FormattedMessage
          id="manageLinksTel"
          defaultMessage="Manage your Phone Links"
        />
      </label>
      <ul className="list-group mt-2">
        {
          user && user.links && user.links.map((l) => (
            l.type === 'sk' || l.type === 'tel' || l.type === 'mb' ?
              <LinkTel
                linkTel={l}
                onDelete={onLinkDelete(l)}
                intl={intl}
              />
              :
              null
          ))
        }
      </ul>
    </fieldset>
  );
});

export default ProfileLinksPhoneForm;