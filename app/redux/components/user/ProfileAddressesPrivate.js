import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import AddressPrivate from '../place/AddressPrivate';

const ProfileAddressesPrivate = injectIntl(({
  user,
  intl,
  userAddressDelete
 }) => {

  const onUserAddressDelete = (address) => (e) => {
    userAddressDelete(user._id, address._id);
  };
  return (
        <fieldset className="form-group">
            <legend>
                <FormattedMessage
                    id="address"
                    defaultMessage="Address"
                />
            </legend>

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
                name="street_number"
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
                name="route"
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
                    name="postal_code"
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
                        name="locality"
                        component="input"
                        placeholder='Locality'
                        value={user.locality}
                    />
                </div>
            </div>
                
            <div className="row">
                <div className="col-md-9 form-group">
                <label htmlFor="administrative_area_level_1">
                    <FormattedMessage
                    id="region"
                    defaultMessage="Region"
                    />
                </label>
                <Field
                    className="form-control"
                    name="administrative_area_level_1"
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
                    {user._countries ?
                        <Field
                            className="form-control custom-select"
                            name="country"
                            component="select"
                            value={user.country}
                        >
                            <option value="">
                                <FormattedMessage
                                    id="Please select"
                                    defaultMessage="Please select"
                                />
                            </option>
                            {user._countries.map((c) => (
                                <option value={c.name}>{c.name}</option>
                            ))
                            }
                            { /* FIXME: How do we handle countries here? */}
                        </Field> :
                        <p>Loading a list of countries…</p>
                    }
                </div>
            </div>
                
            <ul className="list-group mt-2">
                {
                    user && user.addresses && user.addresses.map((a) => (
                        <AddressPrivate
                            address={a}
                            onDelete={onUserAddressDelete(a)}
                            intl={intl}
                        />
                    ))
                }
            </ul>
        </fieldset>
  );
});

export default ProfileAddressesPrivate;
