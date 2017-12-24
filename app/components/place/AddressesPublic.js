import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import AddressPublic from '../place/AddressPublic';

const AddressesPublic = injectIntl(({
  current,
  user,
  intl,
  addressDelete
 }) => {

  const onAddressDelete = (address) => (e) => {
    addressDelete(current._id, address._id);
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
                <div className="col-md-9 form-group">
                    <label htmlFor="locality">
                        <FormattedMessage
                            id="locality"
                            defaultMessage="Locality"
                        />
                    </label>
                    <Field
                        className="form-control"
                        name="locality"
                        component="input"
                        placeholder='Locality'
                        value={current.locality}
                    />
                </div>
                <div className="col-md-3 form-group">
                    <label htmlFor="country">
                        <FormattedMessage
                            id="country"
                            defaultMessage="Country"
                        />
                    </label>
                    {user._countries ?
                        <Field
                            className="form-control custom-select"
                            name="country"
                            component="select"
                            value={current.country}
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
            <label>
                <FormattedMessage
                    id="editFullAddress"
                    defaultMessage="Edit full address in the private section"
                />
            </label>
            <ul className="list-group mt-2">
                {
                    current && current.addresses && current.addresses.map((a) => (
                        <AddressPublic
                            address={a}
                            onDelete={onAddressDelete(a)}
                            intl={intl}
                        />
                    ))
                }
            </ul>
        </fieldset>
  );
});

export default AddressesPublic;
