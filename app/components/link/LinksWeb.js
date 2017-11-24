import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksWeb = (props) => {
  var links = [];
  for(let i in props.links) if (props.links[i].type == "web") links.push(props.links[i]);
  console.log("LinksWeb component" + JSON.stringify(props) );
  
  return (
      <div className="form-group">
        
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

export default LinksWeb;