import { h } from 'preact';

const Address = ({ address, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      {address.locality} : {address.country}     
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onDelete}
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
    </li>
  );
};

export default Address;