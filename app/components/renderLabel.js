import { h } from 'preact';

const renderLabel = ({ input, label, type, meta: { touched, error } }) => (
      <label>{input.value}</label>
  );

export default renderLabel;