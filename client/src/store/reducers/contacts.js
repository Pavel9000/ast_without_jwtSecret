

const initialState = {
    all: {
        "contacts": []
        // "contacts": [
        //     { title: "instagram", href: "http://instagram.com"},
        //     { title: "vk", href: "http://vk.com"}
        // ]
    }
}

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_CONTACTS':
            return {
                ...state, 
                all: {...action.allNew}
            }
        case 'ADD_All_CONTACTS':
            return {
                ...state,
                all: {...action.all, contacts: [...JSON.parse(action.all.contacts)]}
            }
        default:
            return state
    }
}