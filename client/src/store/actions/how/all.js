

export function getAll() {
    return async (dispatch, getState) => {
        // console.log(7)
        try {
                const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/how`
                let headers = {"Content-Type": "application/json; charset=utf-8"}
                if (getState().config.isAdmin) {
                    headers["Token"] = getState().auth.token
                }
                const response = await fetch(url, {
                    method: 'GET',
                    headers
                });
                const json = await response.json()
                if (!json) {
                    return alert('Error authorization')
                }
                dispatch(getAllAll(json))
            
        } catch (e) {
            // dispatch(getListArrError(e))
            // console.log(e)
        }
    }
}

export function getAllAll(all) {
    return {
        type: 'ADD_All_HOW',
        all
    }
}

