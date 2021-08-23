

export function updateOne(id, formData, formDataForLocalUpdate) {
    return async (dispatch, getState) => {

        try {
                const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/admin/home`
                let headers = {}
                if (getState().config.isAdmin) {
                    headers["Token"] = getState().auth.token
                }
                const response = await fetch(url, {
                    method: 'PUT',
                    body: formData,
                    headers
                })
                const json = await response.json()
                if (json.message !== "ok") {
                    return alert('Error authorization')
                }
                let allNew = formDataForLocalUpdate
                return dispatch(update(allNew))
        } catch (e) {
            // updateError(e)
        }
    }
}

export function update(allNew) {
    return {
        type: 'UPDATE_HOME',
        allNew
    }
}

