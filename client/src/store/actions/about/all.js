

export function getAll(_start, _limit) {
    return async (dispatch, getState) => {
        // dispatch(getListArrStart())
        try {
            // console.log()
                const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/about?_start=${_start}&_limit=${_limit}`
                // console.log(url)
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
                    // return dispatch(showModalMessage())
                    return alert('Error authorization')
                }
                // console.log(json)
                if (json.length < _limit) {
                    dispatch(getAllAll(json, false))
                } else {
                    dispatch(getAllAll(json, true))
                }
            
        } catch (e) {
            // dispatch(getListArrError(e))
            // console.log(e)
        }
    }
}

export function getAllAll(all, showMore) {
    return {
        type: 'ADD_LIST_ABOUT',
        all,
        showMore
    }
}

