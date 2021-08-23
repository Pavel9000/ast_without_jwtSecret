
const initialState = {
    url: {
        isDev: false,
        // isDev: true,
        dev: {
            clientPort: ':3000',
            serverPort: ':5000',
            url: 'http://localhost'
            // url: 'http://127.0.0.1'
        }, 
        url: 'http://1ast1.com'
        // url: 'http://77.68.21.146'
    },
    isAdmin: false
}

export default function configReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADMIN_TRUE_CONFIG':
            return {
                ...state,
                isAdmin: true
            }
        default:
            return state
    }
}