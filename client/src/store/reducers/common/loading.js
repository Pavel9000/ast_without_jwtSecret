
const initialState = {
    loading: false
}

export default function loadingReducer(state = initialState, action) {
    switch (action.type) {
        case 'YES_LOADING_LOADING':
            return {
                ...state,
                loading: true
            }
    switch (action.type) {
        case 'NO_LOADING_LOADING':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}