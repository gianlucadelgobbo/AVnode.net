import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import LinkWeb from '../link/LinkWeb';

const ProfileLinksWebForm = injectIntl(({
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
          id="websites"
          defaultMessage="Websites"
        />
      </legend>

      <label htmlFor="linkWeb">
        <FormattedMessage
          id="websiteUrl"
          defaultMessage="Website Url"
        />
      </label>
      <div className="input-group">
        <Field
          className="form-control"
          name="linkWeb"
          component="input"
          placeholder={intl.formatMessage({
            id: 'addUrl',
            defaultMessage: 'Add url'
          })}
        />

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
          id="manageLinksWeb"
          defaultMessage="Manage your Web Links"
        />
      </label>
      <ul className="list-group mt-2">
        {
          user && user.links && user.links.map((l) => (
            l.type === 'web' ?
              <LinkWeb
                linkWeb={l}
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

export default ProfileLinksWebForm;
