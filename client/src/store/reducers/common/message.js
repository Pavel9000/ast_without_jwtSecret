
const initialState = {
    messageType: '',
    messageText: ''
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'MESSAGE_MESSAGE':
            return {
                ...state,
                messageType: action.messageType,
                messageText: action.messageText
            }
        default:
            return state
    }
}