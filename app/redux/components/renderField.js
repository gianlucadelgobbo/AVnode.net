import { h } from 'preact';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
    
  //{/*console.log('renderField:'+ JSON.stringify(input))*/}
  <div className="input-group input-error">
    <label>{label}</label>
    <input className="form-control" {...input} placeholder={label} type={type}/>
    {touched && error && <span className="error-label">{error}</span>}
  </div>
  
  );

export default renderField;