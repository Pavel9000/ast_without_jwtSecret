import React, {Component} from 'react'
import classes from './index.module.css'
import Drawer from '../../components/navigation/drawer'

import {connect} from 'react-redux'
// import {startLoadApp} from '../../store/actions/startLoadApp'


class Layout extends Component {

    state = {
        menu: false
    }

    // componentDidMount() {
        // this.props.startLoadApp()
    // }


    toggleMenu = () => {
        // console.log(this.props.state)
        this.setState({
            menu: !this.state.menu
        })
    }

    menuClose = () => {
        this.setState({
            menu: false
        })
    }

    render() {
        
        return (
            <div className={classes.Layout}>
                   
                {
                    !this.props.token && this.props.isAdmin
                    ? null
                    : <Drawer
                        // isAdmin={this.props.isAdmin}
                        onToggle={this.toggleMenu}
                        isOpen={this.state.menu}
                        onClose={this.menuClose}
                    />
                }

                <main>
                    { this.props.children }
                </main>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        isAdmin: state.config.isAdmin
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        // startLoadApp: () => dispatch(startLoadApp())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Layout)

// export default Layout