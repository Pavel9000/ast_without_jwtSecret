import {combineReducers} from 'redux'
import auth from './auth'
import posts from './posts'
import services from './services'
import about from './about'
import home from './home'
import how from './how'
import contacts from './contacts'
import message from './common/message'
import config from './common/config'

export default combineReducers({
    auth,
    posts,
    home,
    how,
    contacts,
    services,
    about,
    message,
    config
})
