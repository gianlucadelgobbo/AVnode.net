import { h } from 'preact';

import TitleForm from '../TitleForm';
import { addCrew } from '../../reducers/actions';

const CrewAdd = ({ajaxInProgress}) => {
  return (
    <TitleForm
      label="Add Crew"
      placeholder="Name new crew"
      ajaxInProgress={ajaxInProgress}
      action={addCrew}
    />
  );
};

export default CrewAdd;
