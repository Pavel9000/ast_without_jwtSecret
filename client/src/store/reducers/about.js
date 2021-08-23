

const initialState = {
    all: [
        // {
        //     id: "certificate",
        //     amountFiles: 0,
        //     title: "TiT",
        //     video: ``,
        //     descr: `[]`,
        //     isPreview: ``
        // },
        // {
        //     id: "photo",
        //     amountFiles: 0,
        //     title: "TiT",
        //     video: ``,
        //     descr: `[]`,
        //     isPreview: ``
        // },
        // {
        //     id: "0",
        //     video: ``,
        //     descr: `[
        //         {"textContent":"Первоначально необходимо определиться с видом консультации. Для этого вы может связаться со мной по указанным контактам, описав причину, по которой вы обращаетесь или задав вопрос любым удобным для вас образом","textAlign":""},
        //         {"textContent":"После определения вида консультации необходимо произвести оплату услуги в размере 100 % от суммы","textAlign":""},
        //         {"textContent":"Оплата принимается на Яндекс кошелёк, карту Сбербанка, WebMoney и PayPal","textAlign":""},
        //         {"textContent":"Консультации могут быть срочными и не срочными. Время, которое мне потребуется на изучение вопроса может быть от нескольких часов до нескольких дней. Дополнительная плата за срочность не требуется","textAlign":""},
        //         {"textContent":"Консультация проводится online или в письменном формате в согласованное время","textAlign":""},
        //         {"textContent":"В течении двух недель предоставляется возможность задать вопросы, если это потребуется по теме заказанной ранее консультации. Я всегда готова ответить на вопросы и пояснить все неясности","textAlign":""}
        //     ]`
        // }
    ],
    showMore: true
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_ABOUT':
            return {
                ...state, 
                all: [...action.allNew]
            }
        case 'DELETE_ABOUT':
            const allNew = state.all.filter(one => one.id !== action.id)
            return {
                ...state, 
                all: [...allNew]
            }
        case 'ADD_ABOUT':
            return {
                ...state, 
                all: [action.payload, ...state.all]
            }
        case 'ADD_LIST_ABOUT':
            return {
                ...state,
                showMore: action.showMore,
                all: [...state.all, ...action.all]
            }
        default:
            return state
    }
}