
const initialState = {
    token: ''
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'CLEAR_TOKEN_AUTH':
            return {
                ...state,
                token: ''
            }
        case 'ADD_TOKEN_AUTH':
            return {
                ...state, 
                token: action.token
            }
        default:
            return state
    }
}