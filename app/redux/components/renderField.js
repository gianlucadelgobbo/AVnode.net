import { h } from 'preact';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
    
    <div>
      <label>{label}</label>
      <div className='input-group input-error'>
        <input className="form-control" {...input} type={type} placeholder={label}/>
        {touched && error && <span className="error-label">{error}</span>}
      </div>
    </div>
  
  );

export default renderField;
