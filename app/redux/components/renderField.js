import { h } from 'preact';

const renderField = ({ input, label, type, meta: { asyncValidating, touched, error } }) => (
    
  //{/*console.log('renderField:'+ JSON.stringify(input))*/}
  <div>
    <label>{label}</label>
    <div className={asyncValidating ? 'async-validating' : 'input-group input-error'}>
      <input className="form-control" {...input} type={type} placeholder={label} />
      {touched && error && <span className="error-label">{error}</span>}
    </div>
  </div>
  
  );

export default renderField;
