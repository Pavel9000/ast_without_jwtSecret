

const initialState = {
    all: [],
    showMore: true
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_SERVICES':
            return {
                ...state, 
                all: [...action.allNew]
            }
        case 'DELETE_SERVICES':
            const allNew = state.all.filter(one => one.id !== action.id)
            return {
                ...state, 
                all: [...allNew]
            }
        case 'ADD_SERVICES':
            return {
                ...state, 
                all: [action.payload, ...state.all]
            }
        case 'ADD_LIST_SERVICES':
            return {
                ...state,
                showMore: action.showMore,
                all: [...state.all, ...action.all]
            }
        default:
            return state
    }
}