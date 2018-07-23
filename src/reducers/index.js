import {combineReducers} from 'redux';
import cityReducer from './cityReducers';

const rootReducer = combineReducers({
    citys: cityReducer
});

export default rootReducer;
