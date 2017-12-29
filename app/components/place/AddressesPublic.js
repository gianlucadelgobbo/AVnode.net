import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

const AddressesPublic = injectIntl(({
  fields,
    meta: { error, submitFailed },
    intl
 }) => (

        <div>
            <legend>
                <FormattedMessage
                    id="address"
                    defaultMessage="Address"
                />
            </legend>
            {submitFailed && error && <span>{error}</span>}

            {fields.map((address, index) => (
                <div key={index}>
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
                                name={`${address}.locality`}
                                component="input"
                                placeholder='Locality'
                            />
                        </div>
                        <div className="col-md-2 form-group">
                            <label htmlFor="country">
                                <FormattedMessage
                                    id="country"
                                    defaultMessage="Country"
                                />
                            </label>
                            <Field
                                className="form-control"
                                name={`${address}.country`}
                                component="input"
                                placeholder='Country'
                            />
                            { /* {Countries ?
                                <Field
                                    className="form-control custom-select"
                                    name="country"
                                    component="select"
                                >
                                    <option value="">
                                        <FormattedMessage
                                            id="Please select"
                                            defaultMessage="Please select"
                                        />
                                    </option>
                                    {Countries.map((c) => (
                                        <option value={c.name}>{c.name}</option>
                                    ))
                                    }
                                     
                                </Field> :
                                <p>Loading a list of countries…</p>
                            }*/}
                        </div>
                        <div className="col-sm-1">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
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

export default AddressesPublic;
