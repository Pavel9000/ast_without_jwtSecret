
import {message} from './message'
import {addToken} from '../auth'


export function adminTrue() {
    return {
        type: 'ADMIN_TRUE_CONFIG'
    }
}

export function startLoadApp() {
    return async (dispatch, getState) => {
        try {
            if (window
                && window.location.pathname.slice(0,6) === "/admin" 
                && ( window.location.pathname[6] === '/' 
                    || window.location.pathname[6] === undefined
                    ) 
                ) {
                    dispatch(adminTrue())
            }
            if (localStorage.token) {
                return dispatch(addToken(localStorage.token))
            }
        } catch (e) {
            dispatch(message('error', 'error'))
        }
    }
}