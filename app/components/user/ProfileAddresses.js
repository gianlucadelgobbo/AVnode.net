import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Place from '../place/PlaceContainer';
import Address from '../place/Address';
import Layout from '../Layout';
import {
    addressUserMakePrimary,
    editUserAddresses
} from '../../reducers/actions';
import Languages from '../language/Languages';

const ProfileAddressesForm = ({
    user,
    intl,
    handleSubmit,
    addressUserMakePrimary,
    saveProfile
    }) => {

    const onAddressUserMakePrimary = (userId) => (address) => (e) => {
        // useless address.is_primary = true;
        addressUserMakePrimary(userId, address._id);
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit(saveProfile)}>

                <fieldset className="form-group">
                    <legend>
                        <FormattedMessage
                            id="address"
                            defaultMessage="Address"
                        />
                    </legend>

                    <Place user={user} />

                    <ul className="list-group mt-2">
                        {
                            user && user.addresses && user.addresses.map((a) => (
                                <Address
                                    address={a}
                                    onMakePrimary={onAddressUserMakePrimary(user._id)(a)}
                                />
                            ))
                        }
                    </ul>
                </fieldset>

                <div className="form-group">
                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        <FormattedMessage
                            id="form.save"
                            defaultMessage="Save"
                        />
                    </button>
                </div>

            </form>
        </Layout >
    );
};

export default injectIntl(reduxForm({
    form: 'useraddresses',
    enableReinitialize: true
})(ProfileAddressesForm));
