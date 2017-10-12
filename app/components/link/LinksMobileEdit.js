import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksMobileEdit = (args) => {
  var LinkTypes;
  var links = [];
  for(let i in args.links) if (args.links[i].type == "mb") links.push(args.links[i]);
  {args.LinkTypes.find((element) => {
    if ( element.key === 'mb') LinkTypes = element;
  })}

  console.log("LinksMobileEdit component");

  return (
      <div className="form-group">
        <label htmlFor="mb">
          <FormattedMessage
            id="mb"
            defaultMessage="Mobile"
          />
          &nbsp;
          {LinkTypes.privacy == 'public' ?
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
        {console.log(args)}
        {links ?
          links.map((item, i) => (
            <div className="input-group">
              {console.log(item)}
              <Field
                className="form-control"
                name="mb"
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
            name="mb"
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

export default LinksMobileEdit;