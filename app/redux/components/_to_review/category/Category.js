import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Category = injectIntl(({ category, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
        <span>
            {category.name}
        </span>
        <button
            type="button"
            className="btn btn-danger"
            onClick={onDelete}
        >
            <i className="fa fa-trash"></i>
        </button>
    </li>
  );
});

export default Category;