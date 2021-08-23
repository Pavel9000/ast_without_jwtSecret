

export function deleteOne(id) {
    return async (dispatch, getState) => {
        // dispatch(deleteOneStart())
        // return console.log(45)
        try {

            const url = `${getState().config.url.isDev ? (getState().config.url.dev.url+getState().config.url.dev.serverPort) : getState().config.url.url }/api/admin/services/${id}`
            let headers = {"Content-Type": "application/json; charset=utf-8"}
            if (getState().config.isAdmin) {
                headers["Token"] = getState().auth.token
            }
            const response = await fetch(url, {
                method: 'DELETE',
                headers
            })
            const json = await response.json()


            if (json.message !== "ok") {
                // return dispatch(showModalMessage())
                return alert('not deleted')
            }
        
            
            return dispatch(deleteInList(id))

                
        } catch (e) {
            // dispatch(deleteOneError("Error"))
            // console.log("e")
        }
    }
}


export function deleteInList(id) {
    return {
        type: 'DELETE_SERVICES',
        id
    }
}

