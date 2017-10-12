import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksEdit = (args) => {
  var LinkTypes;
  console.log("LinksEdit component");
  let LinkTypes_families = [];
  for(let i in args.LinkTypes) {
    LinkTypes_families.push(args.LinkTypes[i].key);
  }
  let links_families = {};
  for(let l in LinkTypes_families) {
    for(let i in args.links) {
     if (args.links[i].type == LinkTypes_families[l]){
        if (!links_families[args.links[i].type]) links_families[args.links[i].type] = [];
        links_families[args.links[i].type].push(args.links[i]);
      }
    }
    if (!links_families[LinkTypes_families[l]]) links_families[LinkTypes_families[l]] = [];
  }
  return (
    <fieldset className="form-group">
      <legend>
        <FormattedMessage
          id="links"
          defaultMessage="Links"
        />
      </legend>
      /* */
      {LinkTypes_families.indexOf('web')!=-1 ?
        <div className="form-group">
          <label htmlFor="{item}">
            <FormattedMessage
              id="web"
              defaultMessage={"Website"}
            />
            {args.LinkTypes.find((element) => {
              if ( element.key === 'web') LinkTypes = element;
            })}
            console.log(LinkTypes)
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
          &nbsp;
          {links_families['web'].map((item, i) => (
            <div className="input-group">
              <Field
                className="form-control"
                name="web"
                component="input"
                type="text"
                value={links_families['web'][i].url}
              />
              {links_families['web'][i].url}
              <div className="input-group-addon">
                <i className="fa fa-link"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
            </div>

          ))}
          <div className="input-group">
            <Field
              className="form-control"
              name="web"
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
        :
        null
      }
    </fieldset>
  );
};

export default LinksEdit;