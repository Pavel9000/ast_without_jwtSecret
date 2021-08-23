import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Auth from '../pages/auth'
import PostsAll from '../pages/posts/all'
import One from '../pages/posts/one'
import How from '../pages/how'
import Home from '../pages/home'
import Contacts from '../pages/contacts'
import ServicesAll from '../pages/services/all'
import ServicesOne from '../pages/services/one'
import AboutAll from '../pages/about/all'
import AboutOne from '../pages/about/one'
import Astroprocessor from '../pages/astroprocessor'


export const useRoutes = (token, isAdmin) => {
    if (isAdmin) {
        if (token) {
            return (
                <Switch>
                    <Route path='/admin/posts/create' render={(state) => <One createUpdateView={'create'} state={state} />} />
                    <Route path='/admin/posts/update/:id' render={(state) => <One createUpdateView={'update'} state={state} />} />
                    <Route path='/admin/posts/:id' render={(state) => <One createUpdateView={'view'} state={state} />} />
                    <Route path='/admin/posts' exact component={PostsAll} />

                    <Route path='/admin/' exact render={(state) => <Home createUpdateView={'update'} state={state} />} />

                    <Route path='/admin/how' exact render={(state) => <How createUpdateView={'update'} state={state} />} />

                    <Route path='/admin/contacts' exact render={(state) => <Contacts createUpdateView={'update'} state={state} />} />

                    <Route path='/admin/services/create' render={(state) => <ServicesOne createUpdateView={'create'} state={state} />} />
                    <Route path='/admin/services/update/:id' render={(state) => <ServicesOne createUpdateView={'update'} state={state} />} />
                    <Route path='/admin/services/:id' render={(state) => <ServicesOne createUpdateView={'view'} state={state} />} />
                    <Route path='/admin/services' exact component={ServicesAll} />

                    <Route path='/admin/about/update/:id' render={(state) => <AboutOne createUpdateView={'update'} state={state} />} />
                    <Route path='/admin/about/:id' render={(state) => <AboutOne createUpdateView={'view'} state={state} />} />
                    <Route path='/admin/about' render={(state) => <AboutAll createUpdateView={'update'} state={state} />} />

                    <Redirect to='/admin/' />
                </Switch>
            )
        } 
        return (
            <Switch>
                <Route path='/admin/auth'>
                    <Auth />
                </Route>
                <Redirect to='/admin/auth' />
            </Switch>
        )
    }
    if (!isAdmin) {
        return (
            <Switch>
                <Route path='/posts/:id' render={(state) => <One createUpdateView={'view'} state={state} />} />
                <Route path='/posts' exact component={PostsAll} />

                <Route path='/' exact render={(state) => <Home createUpdateView={'view'} state={state} />} />

                <Route path='/how' exact render={(state) => <How createUpdateView={'view'} state={state} />} />

                <Route path='/contacts' exact render={(state) => <Contacts createUpdateView={'view'} state={state} />} />

                <Route path='/services/:id' render={(state) => <ServicesOne createUpdateView={'view'} state={state} />} />
                <Route path='/services' exact component={ServicesAll} />

                <Route path='/about/:id' render={(state) => <AboutOne createUpdateView={'view'} state={state} />} />
                <Route path='/about' render={(state) => <AboutAll createUpdateView={'view'} state={state} />} />

                <Route path='/astroprocessor' exact component={Astroprocessor} />
                
                <Route path='/admin'>
                    <Auth />
                </Route>
                <Redirect to='/' />
            </Switch>
        )
    }
}