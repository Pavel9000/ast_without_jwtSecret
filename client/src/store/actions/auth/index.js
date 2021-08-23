
import {message} from '../common/message'

export function clearToken() {
    localStorage.clear()
    return {
        type: 'CLEAR_TOKEN_AUTH'
    }
}

export function addToken(token) {
    return {
        type: 'ADD_TOKEN_AUTH',
        token: token
    }
}

export function actionLogin(formData) {
    return async (dispatch, getState) => {
        // dispatch(authStart())
        try {
            const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/auth/login`
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    // 'Content-Type': 'application/json'
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            // return console.log(url)
            const json = await response.json()
            // const json = { "token": "jwt_token_login"}
            if (json["token"] === undefined) {
                return dispatch(message('error', 'Error authorization'))
            }
            localStorage.setItem('token', json["token"])
            return dispatch(addToken(json["token"]))
        } catch (error) {
            return dispatch(message('error', 'Error authorization'))
        }
    }
}

export function actionRegister(formData) {
    return async (dispatch, getState) => {
        // dispatch(authStart())
        try {
            const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/auth/register`
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    // 'Content-Type': 'application/json'
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            const json = await response.json()
            return console.log(json)
            // const json = {}
            // json["token"] = "jwt_token_register"
            if (json["token"] === undefined) {
                return dispatch(message('error', 'Error registration'))
            }
            localStorage.setItem('token', json["token"])
            return dispatch(addToken(json["token"]))
        } catch (error) {
            return dispatch(message('error', 'Error registration'))
        }
    }
}