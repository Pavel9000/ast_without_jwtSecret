import React, {Component} from 'react'
import {connect} from 'react-redux'
import classes from './index.module.css'
import {NavLink} from 'react-router-dom'
import Backdrop from '../../UI/backdrop'
import {clearToken} from '../../../store/actions/auth'


class Drawer extends Component {

    clickNavLink = (link_to) => {
        if (link_to === '/admin/auth') {
            this.props.clearToken()
        }
        this.props.onClose()
    }
    
    renderLinks(links) {
        return links.map((link, index) => {
            return (
                <React.Fragment key={index}>
                    <li>
                        <NavLink
                            to={link.to}
                            exact={link.exact}
                            activeClassName={classes.active}
                            onClick={() => this.clickNavLink(link.to)}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                    {/* <hr  /> */}
                </React.Fragment>
            )
        })
    }

    render() {

        let links
        if (this.props.isAdmin) {
            links = [
                {to: '/admin/', label: 'Главная', exact: true},
                {to: '/admin/services', label: 'Мои услуги', exact: true},
                {to: '/admin/how', label: 'Как получить консультацию', exact: true},
                {to: '/admin/posts', label: 'Мои статьи', exact: true},
                {to: '/admin/about', label: 'Обо мне', exact: true},
                {to: '/admin/contacts', label: 'Контакты', exact: true},
                {to: '/admin/auth', label: 'Выйти', exact: true}
                // {to: '/admin/posts', label: 'Посты', exact: true},
                // {to: '/admin/create', label: 'Создать пост', exact: false},
            ]
        } else {
            links = [
                {to: '/', label: 'Главная', exact: true},
                {to: '/services', label: 'Мои услуги', exact: true},
                {to: '/how', label: 'Как получить консультацию', exact: true},
                {to: '/posts', label: 'Мои статьи', exact: true},
                {to: '/about', label: 'Обо мне', exact: true},
                {to: '/contacts', label: 'Контакты', exact: true},
                {to: '/astroprocessor', label: 'Астропроцессор', exact: true}
            ]
        }
        
        const cls = [classes.Drawer]

        if (!this.props.isOpen) {
            cls.push(classes.close)
        }

        return (
            <React.Fragment>
                <div
                    className={[classes.MenuToggle, classes.close].join(' ')} 
                    onClick={this.props.onToggle}
                >
                    |||
                </div>
                <nav className={cls.join(' ')}>
                    <ul>
                        <li className={[classes.MenuToggle, classes.open].join(' ')} >
                            <svg onClick={this.props.onToggle} viewBox="0 0 40 40" width="1em" height="1em"><path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z"></path></svg>
                        </li>
                        {/* <li><div onClick={() => this.props.onClose()}>x</div></li> */}
                        { this.renderLinks(links) }
                    </ul>
                </nav>
                {
                    this.props.isOpen
                        ? <Backdrop onClick={() => this.props.onClose()}/>
                        : null
                }
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAdmin: state.config.isAdmin
    }
  }

function mapDispatchToProps(dispatch) {
    return {
        clearToken: () => dispatch(clearToken()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)

// export default Drawer