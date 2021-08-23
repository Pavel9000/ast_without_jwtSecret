import React, {Component} from 'react';
import LayoutFrontPage from './layouts/frontPage/index'
import {useRoutes} from './routes'

import {connect} from 'react-redux'
import {startLoadApp} from './store/actions/common/startLoadApp'


// function App() {
class App extends Component {

  
  componentDidMount() {
      this.props.startLoadApp()
  }



  
  render() {
    const routes = useRoutes(this.props.token, this.props.isAdmin)
    return (
        <LayoutFrontPage>
          {routes}
        </LayoutFrontPage>
    )
}
  
  // return (
  //   <LayoutFrontPage>
  //     {routes}
  //   </LayoutFrontPage>
  // );
}



function mapStateToProps(state) {
  return {
      token: state.auth.token,
      isAdmin: state.config.isAdmin
  }
}

function mapDispatchToProps(dispatch) {
  return {
      startLoadApp: () => dispatch(startLoadApp())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

// export default App;
