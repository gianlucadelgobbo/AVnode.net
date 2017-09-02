import { h } from 'preact';

import TitleForm from '../TitleForm';
import { addPerformance } from '../../reducers/actions';

const PerformanceAdd = ({ajaxInProgress}) => {
  return (
    <TitleForm
      label="Add Performance"
      placeholder="Name new performance"
      ajaxInProgress={ajaxInProgress}
      action={addPerformance}
    />
  );
};

export default PerformanceAdd;
