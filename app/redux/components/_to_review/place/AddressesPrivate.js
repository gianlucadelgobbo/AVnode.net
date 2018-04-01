import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field } from 'redux-form';
import renderField from '../renderField';

const AddressesPrivate = injectIntl(({
  fields,
  countries,
  userId,
  meta: { error, submitFailed },
  intl
}) => (
    <div>
      <legend>
        <FormattedMessage
          id="addresses"
          defaultMessage="Addresses"
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}
      {/*console.log('userId:' + userId)*/}
      {fields.map((address, index) => (
        <div key={index}>
          <label>
            {intl.formatMessage({
              id: 'address',
              defaultMessage: 'Address'
            })} {index + 1}
          </label>
          <div className="row">
            <div className="col-md-3 form-group">
              <label htmlFor="street_number">
                <FormattedMessage
                  id="street_number"
                  defaultMessage="Street Number"
                />
              </label>
              <Field
                className="form-control"
                name={`${address}.street_number`}
                component="input"
              />
            </div>
            <div className="col-md-9 form-group">
              <label htmlFor="route">
                <FormattedMessage
                  id="route"
                  defaultMessage="Street"
                />
              </label>
              <Field
                className="form-control"
                name={`${address}.route`}
                component="input"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 form-group">
              <label htmlFor="postal_code">
                <FormattedMessage
                  id="postal_code"
                  defaultMessage="Postal code"
                />
              </label>
              <Field
                className="form-control"
                name={`${address}.postal_code`}
                component="input"
              />
            </div>
            <div className="col-md-9 form-group">
              <label htmlFor="locality">
                <FormattedMessage
                  id="locality"
                  defaultMessage="Locality"
                />
              </label>
              <span className="badge badge-success">
                <FormattedMessage
                  id="public"
                  defaultMessage='PUBLIC'
                />
              </span>
              <Field
                className="form-control"
                name={`${address}.locality`}
                component="input"
                placeholder='Locality'
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 form-group">
              <label htmlFor="administrative_area_level_1">
                <FormattedMessage
                  id="region"
                  defaultMessage="Region"
                />
              </label>
              <Field
                className="form-control"
                name={`${address}.administrative_area_level_1`}
                component="input"
              />
            </div>
            <div className="col-md-3 form-group">
              <label htmlFor="country">
                <FormattedMessage
                  id="country"
                  defaultMessage="Country"
                />
              </label>
              <span className="badge badge-success">
                <FormattedMessage
                  id="public"
                  defaultMessage='PUBLIC'
                />
              </span>
              {countries ?
                <Field
                  className="form-control custom-select"
                  name={`${address}.country`}
                  component="select"
                  value={`${address}.country`}
                >
                  <option value="">
                    <FormattedMessage
                      id="Please select"
                      defaultMessage="Please select"
                    />
                  </option>
                  {countries.map((c) => (
                    <option value={c.name}>{c.name}</option>
                  ))
                  }
                </Field> :
                <p>Loading a list of countries…</p>
              }
            </div>


            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => fields.remove(index)}
              >
                <i
                  className="fa fa-trash"
                  data-toggle="tooltip"
                  data-placement="top"
                  title={intl.formatMessage({
                    id: 'delete',
                    defaultMessage: 'Delete'
                  })}
                >
                </i>
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => fields.push({})}>
        <i
          className="fa fa-plus"
          data-toggle="tooltip"
          data-placement="top"
          title={intl.formatMessage({
            id: 'add',
            defaultMessage: 'Add'
          })}
        >
        </i>
      </button>
      <label>
        <FormattedMessage
          id="addAddress"
          defaultMessage="Add Address"
        />
      </label>
    </div>
  ));

export default AddressesPrivate;
