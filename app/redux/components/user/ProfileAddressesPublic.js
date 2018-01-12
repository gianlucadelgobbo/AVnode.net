import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import AddressPublic from '../place/AddressPublic';

const ProfileAddressesPublic = injectIntl(({
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
                        value={user.locality}
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
            <label>
                <FormattedMessage
                    id="editFullAddress"
                    defaultMessage="Edit full address in the private section"
                />
            </label>
            <ul className="list-group mt-2">
                {
                    user && user.addresses && user.addresses.map((a) => (
                        <AddressPublic
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

export default ProfileAddressesPublic;
