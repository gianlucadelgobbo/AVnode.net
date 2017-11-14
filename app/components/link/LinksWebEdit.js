import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksWebEdit = (props) => {
  var links = [];
  for(let i in props.links) if (props.links[i].type == "web") links.push(props.links[i]);

  console.log("LinksWebEdit component" + JSON.stringify(props) );

  return (
      <div className="form-group">
        <label htmlFor="web">
          <FormattedMessage
            id="web"
            defaultMessage="Websites"
          />
          &nbsp;
          
        </label>
        <Field
          className="form-control"
          name="url"
          component="input"
          type="text"
          value={props.links[0].url}
        />
        {links ?
          links.map((item, i) => (
            <div className="input-group">
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

      </div>
  );
};

export default LinksWebEdit;