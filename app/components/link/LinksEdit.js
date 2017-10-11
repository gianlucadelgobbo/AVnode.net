import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksEdit = (args) => {
  console.log(args);
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


      {Object.keys(links_families).map((item, i) => (
        <div className="form-group">
          {console.log(args.LinkTypes[i].name)}
          <label htmlFor="{item}">
            <FormattedMessage
              id="{item}"
              defaultMessage={'{title} {visibility}'}
              values={{title: args.LinkTypes[i].name, visibility: args.LinkTypes[i].privacy == 'public' ? <span class="badge badge-success">PUBLIC</span> : <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
            {links_families[item].map((c, i) => (
              <div className="input-group">
                <Field
                  className="form-control"
                  name={`${item}[${i}]`}
                  component="input"
                  type="text"
                  value={c.url}
                />
                {c.url}
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
              name={`${item}[${links_families[item].length}]`}
              component="input"
              type="text"
              value=''
            />
            <div className="input-group-addon">
              <i className="fa fa-link"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>

        </div>
      ))}
    </fieldset>
  );
};

export default LinksEdit;