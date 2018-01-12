import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import renderLegend from '../renderLegend';

const AddressesPublic = injectIntl(({
  fields,
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
    
<ul className="list-group mt-2">

    {fields.map((address, index) => (
        <li key={index} className="list-group-item justify-content-between">
        
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
                        component={renderLegend}
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
                        component={renderLegend}
                        placeholder='Country'
                    />
                    
                </div>
                
            </div>
        </li>
    ))}
    
</ul>
</div>
));

export default AddressesPublic;
