import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksMobileEdit = (args) => {
  var links = [];
  for(let i in args.links) if (args.links[i].type == "mb") links.push(args.links[i]);

  // console.log("LinksMobileEdit component");

  return (
      <div className="form-group">
        <label htmlFor="mb">
          <FormattedMessage
            id="mb"
            defaultMessage="Mobile"
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
                name="mb"
                component="input"
                type="text"
                placeholder="Your mobile number"
                value={item.url}
              />
              {item.url}
              <span class="input-group-btn">
                <a href={`tel:${item.url}`} target="_blank" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Call Mobile"><i className="fa fa-link"></i></a>
              </span>
              <span class="input-group-btn">
                <button onClick={console.log('remove '+{i})} class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Remove Mobile"><i className="fa fa-minus"></i></button>
              </span>
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
            placeholder="Your mobile number"
          />
          <span class="input-group-btn">
            <button onClick={e => { e.preventDefault(); console.log('add ') }} class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="Add Mobile"><i className="fa fa-plus"></i></button>
          </span>
        </div>
      </div>
  );
};

export default LinksMobileEdit;