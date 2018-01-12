import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import LinkSocial from '../link/LinkSocial';
import SocialLinkTypes from '../link/SocialLinkTypes';

const ProfileLinksSocialForm = injectIntl(({
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
          id="socials"
          defaultMessage="Social channels"
        />
      </legend>

      <label htmlFor="linkSocial">
        <FormattedMessage
          id="url"
          defaultMessage="Url"
        />
      </label>

      <div className="input-group">
        <div className="input-group">
          <Field
            className="form-control"
            name="linkSocial"
            component="input"
            placeholder={intl.formatMessage({
              id: 'link.placeholder',
              defaultMessage: 'Add url'
            })}
          />
        </div>

        <div className="input-group-addon">

          {SocialLinkTypes ?
            <Field
              className="form-control custom-select"
              name="linkType"
              component="select"
              value={user.linkType}
            >
              {SocialLinkTypes.map((c) => (
                <option value={c.key.toLowerCase()}>{c.name}</option>
              ))
              }
            </Field> :
            <p>Loading a link types…</p>
          }
        </div>
        <div className="input-group-addon">
          <button
            className="btn btn-success btn-sm"
          >
            <i className="fa fa-link"></i>
          </button>
        </div>
      </div>
      <label>
        <FormattedMessage
          id="manageLinksSocial"
          defaultMessage="Manage your Social Links"
        />
      </label>
      <ul className="list-group mt-2">
        {
          user && user.links && user.links.map((l) => (
            l.type === 'tw' || l.type === 'fb' || l.type === 'ot' ?
              <LinkSocial
                linkSocial={l}
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

export default ProfileLinksSocialForm;