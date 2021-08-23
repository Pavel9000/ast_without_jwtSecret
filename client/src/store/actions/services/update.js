

export function updateOne(id, formData, formDataForLocalUpdate) {
    return async (dispatch, getState) => {

        try {
                const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/admin/services/${id}`
                let headers = {}
            // let headers = {"Content-Type": "application/json; charset=utf-8"}
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
                    // return dispatch(showModalMessage())
                    return alert('Error authorization')
                }
                // return console.log(formData)

                let allNew = getState().services.all.map((one) => {
                    if (one.id === id) {
                        one = formDataForLocalUpdate
                        return one
                    } else { return one }
                })
                
                return dispatch(update(allNew))
            
            
        } catch (e) {
            // updateError(e)
        }
    }
}

export function update(allNew) {
    return {
        type: 'UPDATE_SERVICES',
        allNew
    }
}

