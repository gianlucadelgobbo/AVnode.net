import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Place from '../place/PlaceContainer';
import Address from '../place/Address';
import Layout from '../Layout';

const ProfileAddressesForm = ({
    user,
    intl,
    handleSubmit,
    userAddressMakePrimary,
    userAddressMakePrivate,
    userAddressMakePublic,
    userAddressDelete,
    saveProfile
    }) => {

  const onUserAddressMakePrimary = (userId) => (address) => (e) => {
    userAddressMakePrimary(userId, address._id);
  };
  const onUserAddressMakePrivate = (userId) => (address) => (e) => {
    userAddressMakePrivate(userId, address._id);
  };
  const onUserAddressMakePublic = (userId) => (address) => (e) => {
    userAddressMakePublic(userId, address._id);
  };
  const onUserAddressDelete = (userId) => (address) => (e) => {
    userAddressDelete(userId, address._id);
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
            <ul className="list-group mt-2">
                {
                    user && user.addresses && user.addresses.map((a) => (
                        <Address
                            address={a}
                            onMakePrimary={onUserAddressMakePrimary(user._id)(a)}
                            onMakePrivate={onUserAddressMakePrivate(user._id)(a)}
                            onMakePublic={onUserAddressMakePublic(user._id)(a)}
                            onDelete={onUserAddressDelete(user._id)(a)}
                            intl={intl}
                        />
                    ))
                }
            </ul>
        </fieldset>
      </form>
    </Layout >
  );
};

export default injectIntl(reduxForm({
  form: 'userAddresses',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ProfileAddressesForm));
