import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksSocialEdit = (args) => {
  var links = [];
  for(let i in args.links) if (args.links[i].type == "tw") links.push(args.links[i]);

  // console.log("LinksSocialEdit component");

  return (
      <div className="form-group">
        <label htmlFor="tw">
          <FormattedMessage
            id="tw"
            defaultMessage="Social channels"
          />
          &nbsp;
          {args.privacy == 'public' ?
            <span class="badge badge-success">
              <FormattedMessage
                id="public"
                defaultMessage='PUBLIC'
              />
            </span>
            :
            <span class="badge badge-danger">
              <FormattedMessage
                id="private"
                defaultMessage='PRIVATE'
              />
            </span>
          }
        </label>
        {links ?
          links.map((item, i) => (
            <div className="input-group">
              <Field
                className="form-control"
                name="tw"
                component="input"
                type="text"
                value={item.url}
              />
              {item.url}
              <div className="input-group-addon">
                <i className="fa fa-link"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
            </div>
          ))
        :
        null
        }
        <div className="input-group">
          <Field
            className="form-control"
            name="tw"
            component="input"
            type="text"
          />
          <div className="input-group-addon">
            <i className="fa fa-link"></i>
          </div>
          <div className="input-group-addon">
            <i className="fa fa-plus"></i>
          </div>
        </div>
      </div>
  );
};

export default LinksSocialEdit;