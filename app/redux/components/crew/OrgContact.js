import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const OrgContact = (props) => {

  return (
    <div>
      <div className="row">
        <div className="col-md-6 form-group">
          <label htmlFor="crew.org.contact_title">
            <FormattedMessage
              id="crew.org.contact_title"
              defaultMessage="Organisation contact title"
            />
            &nbsp;
            <span className="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
          </label>
          <Field
              className="form-control custom-select"
              name="crew.org.contact_title"
              component="select"
          >
            <option value="">
              <FormattedMessage
                  id="crew.edit.form.label.crew.org.contact_title.empty"
                  defaultMessage="Please select"
              />
            </option>
            <option value="en">
              <FormattedMessage
                  id="crew.edit.form.label.crew.org.contact_title.mr"
                  defaultMessage="Mr."
              />
            </option>
            <option value="it">
              <FormattedMessage
                  id="crew.edit.form.label.crew.org.contact_language.miss"
                  defaultMessage="Miss"
              />
            </option>
          </Field>
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="crew.org.contact_role">
            <FormattedMessage
              id="crew.org.contact_role"
              defaultMessage="Organisation contact role"
            />
            &nbsp;
            <span className="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
          </label>
          <Field
              className="form-control"
              name="crew.org.contact_role"
              component="input"
              type="text"
              value={props.contact.contact_role}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 form-group">
          <label htmlFor="crew.org.contact_name">
            <FormattedMessage
                id="crew.org.contact_name"
                defaultMessage="Organisation contact name"
            />
            &nbsp;
            <span className="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='Private'
              />
            </span>
          </label>
          <Field
              className="form-control"
              name="crew.org.contact_name"
              component="input"
              type="text"
              value={props.contact.contact_name}
          />
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor="crew.org.contact_surname">
            <FormattedMessage
                id="crew.org.contact_surname"
                defaultMessage="Organisation contact surname"
            />
          </label>
          &nbsp;
          <span className="badge badge-danger">
                  <FormattedMessage
                      id="private"
                      defaultMessage='Private'
                  />
              </span>
          <Field
              className="form-control"
              name="crew.org.contact_surname"
              component="input"
              type="text"
              value={props.contact.contact_surname}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="crew.org.contact_email">
          <FormattedMessage
              id="crew.org.contact_email"
              defaultMessage="Organisation contact email"
          />
          &nbsp;
          <span className="badge badge-danger">
              <FormattedMessage
                  id="private"
                  defaultMessage='Private'
              />
            </span>
        </label>
        <div className="input-group">
          <Field
              className="form-control"
              name="crew.org.contact_email"
              component="input"
              type="text"
              value={props.contact.contact_email}
          />
          <div className="input-group-addon">
            <i className="fa fa-envelope"></i>
          </div>
          <div className="input-group-addon">
            <i className="fa fa-minus"></i>
          </div>
          <div className="input-group-addon">
            <i className="fa fa-plus"></i>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="crew.org.contact_language">
          <FormattedMessage
              id="crew.org.contact_language"
              defaultMessage="Organisation contact language"
          />
          &nbsp;
          <span className="badge badge-danger">
              <FormattedMessage
                  id="private"
                  defaultMessage='Private'
              />
            </span>
        </label>
        <Field
            className="form-control custom-select"
            name="crew.org.contact_language"
            component="select"
        >
          <option value="">
            <FormattedMessage
                id="crew.edit.form.label.crew.org.contact_language.empty"
                defaultMessage="Please select"
            />
          </option>
          <option value="en">
            <FormattedMessage
                id="crew.edit.form.label.crew.org.contact_language.en"
                defaultMessage="English"
            />
          </option>
          <option value="it">
            <FormattedMessage
                id="crew.edit.form.label.crew.org.contact_language.it"
                defaultMessage="Italiano"
            />
          </option>
        </Field>
      </div>

      {/* BL TODO <LinksMobileEdit links={props.contact.links} privacy="private" />

      <LinksSkypeEdit links={props.contact.links} privacy="private" />

  <LinksSocialEdit links={props.contact.links} privacy="public" /> */}
    </div>
  );
};

export default OrgContact;