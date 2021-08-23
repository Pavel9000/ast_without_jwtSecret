

const initialState = {
    all: [],
    showMore: true
}

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_POSTS':
            return {
                ...state, 
                all: [...action.allNew]
            }
        case 'DELETE_POSTS':
            const allNew = state.all.filter(one => one.id !== action.id)
            return {
                ...state, 
                all: [...allNew]
            }
        case 'ADD_POSTS':
            return {
                ...state, 
                all: [action.payload, ...state.all]
            }
        case 'ADD_LIST_POSTS':
            return {
                ...state,
                showMore: action.showMore,
                all: [...state.all, ...action.all]
            }
        default:
            return state
    }
}