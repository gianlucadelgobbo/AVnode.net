import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Category = ({ category }) => {
    return (
        <li className="list-group-item justify-content-between">
            {category.name}
            <button
                type="button"
                className="btn btn-secondary btn-sm"
            >
                <FormattedMessage
                    id="user.edit.form.label.category.action.delete"
                    defaultMessage="Delete"
                />
            </button>
        </li>
    );
};

export default Category;