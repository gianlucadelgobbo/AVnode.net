import * as api from '../../../api';
import {arrayOfUsers} from './schema';
import {fetchList as generateFetchList} from '../../../actions/'
import * as selectors from "../selectors";
import * as constants from '../constants';

export const fetchList = () => generateFetchList({
    constants,
    selectors,
    schema: arrayOfUsers,
    request: api.fetchUsers
});
