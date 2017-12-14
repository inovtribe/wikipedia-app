import store from '@/store'
import { loadLocal } from './actions'

// savedItems:
export default function (state = [], action) {
    switch (action.type) {
        case 'SAVED/LOAD_LOCAL': {
            store.dispatch(loadLocal())
            return state
        }
        case 'SAVED/LOCAL_LOADED': {
            return action.payload
        }
        case 'SAVED/SUMMARY_RECEIVED': {

            return state
        }

        default:
            return state;
    }
}

/* 
actions:
add
remove
clear

*/