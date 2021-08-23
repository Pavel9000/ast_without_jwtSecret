
export function add(formData) {
    return {
        type: 'ADD_POSTS',
        payload: formData
    }
}


export function createOne(formData) {
    return async (dispatch, getState) => {
        try {
            const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/admin/posts`
            let headers = {}
            // let headers = {"Content-Type": "application/json; charset=utf-8"}
            // let headers = {"Content-Type": "multipart/form-data"}
            if (getState().config.isAdmin) {
                headers["Token"] = getState().auth.token
            }
            const response = await fetch(url, {
                method: 'POST',
                // body: JSON.stringify(formData),
                body: formData,
                headers
            })
            const json = await response.json()
            if (!json) {
                // return dispatch(showModalMessage())
                return alert('Error authorization')
            }
            // return 
            // console.log(json)
            dispatch(add(json))
            // console.log(getState())
        } catch (e) {
            // dispatch(showModalMessage())
        }
    }
}