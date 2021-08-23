

const initialState = {
    all: {
        "descr": ``,
        "video": ``
    }
    // all: {"descr": `[
    //     {"textContent":"Добро пожаловать на мой официальный сайт!","textAlign":""},
    //     {"textContent":"Здесь можно пообщаться со мной,","textAlign":""},
    //     {"textContent":"почитать интересные статьи,","textAlign":""},
    //     {"textContent":"построить и проанализировать свои карты в","textAlign":""},
    //     {"textContent":"астропроцессоре","textAlign":""}
    // ]`}
}

export default function postsReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_HOME':
            return {
                ...state, 
                all: {...action.allNew}
            }
        case 'ADD_All_HOME':
            return {
                ...state,
                all: {...action.all}
            }
        default:
            return state
    }
}