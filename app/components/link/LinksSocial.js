import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';

const LinksSocialEdit = (args) => {
  var links = [];
  for(let i in args.links) if (args.links[i].type == "tw") links.push(args.links[i]);

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

export default LinksSocialEdit;