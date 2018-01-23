import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';
/*import LinksSocialEdit from '../link/LinksSocialEdit';
import LinksWebEdit from '../link/LinksWebEdit'; */
import AddressesPublic from '../place/AddressesPublic';

import ImageDropzone from '../ImageDropzone';

const OrgActivity = (props) => {

  // console.log("OrgActivity component");
  // console.log(props);

  const onImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewImage(crewId, file));
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="activity_name">
          <FormattedMessage
              id="activity_name"
              defaultMessage="Activity Name"
          />
          &nbsp;
          <span className="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage='Public'
            />
          </span>
        </label>
        <Field
            className="form-control"
            name="activity_name"
            component="input"
            type="text"
            value={props.contact.activity_name}
        />
      </div>

      <div className="form-group">
        <label htmlFor="activity_logo">
          <FormattedMessage
              id="activity_logo"
              defaultMessage="Activity logo (.svg only)"
          />
        </label>
        &nbsp;
        <span className="badge badge-success">
                <FormattedMessage
                    id="public"
                    defaultMessage='Public'
                />
            </span>
        {props.contact.activity_logo ?
            <div>
              <img
                  className="img-thumbnail mb-3"
                  src={props.contact.activity_logo.publicUrl}
                  alt={`Logo of ${props.contact.org.name}`}
              />
            </div> :
            null
        }
        <ImageDropzone
            imageUploadInProgress={(props.contact.imageUploadInProgress)}
            onDrop={onImageDrop(props.contact._id)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="activity_start_date">
          <FormattedMessage
              id="activity_start_date"
              defaultMessage="Activity start date"
          />
        </label>
        &nbsp;
        <span className="badge badge-success">
                <FormattedMessage
                    id="public"
                    defaultMessage='Public'
                />
            </span>
        <div className="input-group">
          <div className="input-group-addon">
            <i className="fa fa-calendar"></i>
          </div>
          <Field
              className="form-control"
              name="activity_start_date"
              component="input"
              type="text"
              value={props.contact.activity_start_date}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="activity_is_running">
          <FormattedMessage
              id="activity_is_running"
              defaultMessage="Activity is running?"
          />
        </label>
        &nbsp;
        <span className="badge badge-success">
                <FormattedMessage
                    id="public"
                    defaultMessage='Public'
                />
            </span>
        <div>
          <input type="radio" value="1" name="activity_is_running" /> YES
          <input type="radio" value="0" name="activity_is_running" /> NO
        </div>

      </div>

      <div className="form-group">
        <label htmlFor="activity_end_date">
          <FormattedMessage
              id="activity_end_date"
              defaultMessage="Activity end date (only if it is not running)"
          />
        </label>
        &nbsp;
        <span className="badge badge-success">
                <FormattedMessage
                    id="public"
                    defaultMessage='Public'
                />
            </span>
        <div className="input-group">
          <div className="input-group-addon">
            <i className="fa fa-calendar"></i>
          </div>
          <Field
              className="form-control"
              name="activity_end_date"
              component="input"
              type="text"
              value={props.contact.activity_end_date}
          />
        </div>

      </div>

      <div className="form-group">
        <label htmlFor="activity_month">
          <FormattedMessage
              id="activity_season"
              defaultMessage="Activity main season"
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
            className="form-control custom-select"
            name="activity_season"
            component="select"
        >
          <option value="">
            <FormattedMessage
                id="empty"
                defaultMessage="Please select"
            />
          </option>
          <option value='fullyear'>
            <FormattedMessage
                id="fullyear"
                defaultMessage="Full year"
            />
          </option>
          <option value='winter'>
            <FormattedMessage
                id="winter"
                defaultMessage="Winter"
            />
          </option>
          <option value='spring'>
            <FormattedMessage
                id="spring"
                defaultMessage="Spring"
            />
          </option>
          <option value='summer'>
            <FormattedMessage
                id="summer"
                defaultMessage="Summer"
            />
          </option>
          <option value='autumn'>
            <FormattedMessage
                id="autumn"
                defaultMessage="Autumn"
            />
          </option>
          <option value='01'>
            <FormattedMessage
                id="january"
                defaultMessage="January"
            />
          </option>
          <option value='02'>
            <FormattedMessage
                id="february"
                defaultMessage="February"
            />
          </option>
          <option value='03'>
            <FormattedMessage
                id="march"
                defaultMessage="March"
            />
          </option>
          <option value='04'>
            <FormattedMessage
                id="april"
                defaultMessage="April"
            />
          </option>
          <option value='05'>
            <FormattedMessage
                id="may"
                defaultMessage="May"
            />
          </option>
          <option value='06'>
            <FormattedMessage
                id="june"
                defaultMessage="June"
            />
          </option>
          <option value='07'>
            <FormattedMessage
                id="july"
                defaultMessage="July"
            />
          </option>
          <option value='08'>
            <FormattedMessage
                id="august"
                defaultMessage="August"
            />
          </option>
          <option value='09'>
            <FormattedMessage
                id="september"
                defaultMessage="September"
            />
          </option>
          <option value='10'>
            <FormattedMessage
                id="october"
                defaultMessage="October"
            />
          </option>
          <option value='11'>
            <FormattedMessage
                id="november"
                defaultMessage="November"
            />
          </option>
          <option value='12'>
            <FormattedMessage
                id="december"
                defaultMessage="December"
            />
          </option>
        </Field>
      </div>

      <div className="form-group">
        <label htmlFor="activity_city">
          <FormattedMessage
              id="activity_address"
              defaultMessage="Activity cities"
          />
        </label>
        &nbsp;
        <span className="badge badge-success">
                <FormattedMessage
                    id="public"
                    defaultMessage='Public'
                />
        </span>
          <AddressesPublic
            current={props.user}
            user={props.user}
            intl={intl}
            addressDelete={addressDelete}
          />
        <div className="input-group">
          <Field
              className="form-control"
              name="activity_city"
              component="input"
              type="text"
              value={props.contact.activity_end_date}
          />
          <Field
              className="form-control custom-select"
              name="activity_country"
              component="select"
          >
            <option value="">
              <FormattedMessage
                  id="crew.edit.form.label.activity_country.empty"
                  defaultMessage="Please select a country"
              />
            </option>
            <option value="en">
              <FormattedMessage
                  id="crew.edit.form.label.activity_country.en"
                  defaultMessage="English"
              />
            </option>
            <option value="it">
              <FormattedMessage
                  id="crew.edit.form.label.activity_country.it"
                  defaultMessage="Italiano"
              />
            </option>
          </Field>

          <div className="input-group-addon">
            <i className="fa fa-minus"></i>
          </div>
          <div className="input-group-addon">
            <i className="fa fa-plus"></i>
          </div>
        </div>
      </div>

      {/* BL TODO <LinksWebEdit links={props.contact.links} privacy="public" />

      <LinksSocialEdit links={props.contact.links} privacy="public" />*/}

    </div>
  );
};

export default OrgActivity;