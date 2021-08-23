import React, {Component} from 'react'
import classes from './index.module.css'
import Loader from '../../components/UI/loader'
import Button from '../../components/UI/button'
import Backdrop from '../../components/UI/backdrop'
import {connect} from 'react-redux'
import {getAll} from '../../store/actions/contacts/all'
import {updateOne} from '../../store/actions/contacts/update'

class Contacts extends Component {

    state = {
        showModalAddVideo: false,
        loader: false,
        isFormValid: false,
        formControls: {
            contacts: {
                value: [], // `https://www.youtube.com/watch?v=-3P2USPFDcE watch?v=`  embed/
                type: 'contacts',
                label: 'Контакты',
                errorMessage: 'Добавьте контакты',
                valid: true,
                touched: true,
                validation: false
            }
        }
    }


    async componentDidMount() {
        this.setState({loader: true})
        if (!this.props.contacts.all.contacts.length) {
            await this.props.getAll()
        }
        let formControls = {...this.state.formControls}
        if (this.props.contacts.all.contacts.length) { formControls.contacts.value = this.props.contacts.all.contacts }
        // console.log(this.props.contacts.all)
        this.setState({formControls})
        this.setState({loader: false})
        // console.log(this.state)
    }

    validateControl(value, validation) {
        if (!validation) {
            return true
        }
        if (validation.required) {
            if (value.trim() === '') {
                return false
            }
        }
        return true
    }
    onChange = (value, controlName) => {
        const formControls = {...this.state.formControls}
        formControls[controlName].touched = true
        if (controlName !== 'descr' && controlName !== 'contacts') {formControls[controlName].value = value}
        for (let formC in formControls) {
            if (this.state.createUpdateView === 'update') { formControls[formC].touched = true }
            formControls[formC].valid = this.validateControl(value, formControls[formC].validation)
        }
        let isFormValid = true
        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })
        this.setState({formControls, isFormValid})
    }

    save = async () => {
        // return console.log(this.state.formControls.contacts.value)
        if (!this.props.token) { return alert('no authorization') }
        let formDataForLocalUpdate = {
            "contacts": JSON.stringify(this.state.formControls.contacts.value)
        }
        var formData = new FormData();
        await formData.append("contacts", formDataForLocalUpdate["contacts"])
        if (this.props.createUpdateView === 'update') {
            await this.props.updateOne(null, formData, formDataForLocalUpdate)
            this.setState({isFormValid: false})
        }
    }


    deleteContact = (i) => {
        let newFormControls = this.state.formControls
        newFormControls.contacts.value = newFormControls.contacts.value.filter((val, index) => index !== i )
        this.setState({
            formControls: newFormControls
        })
        this.onChange(this.state.formControls.contacts.value, 'contacts')
    }

    addContact = (title, href) => {
        let newFormControls = this.state.formControls
        newFormControls.contacts.value.push( { title, href } )
        this.setState({
            formControls: newFormControls,
            showModalAddVideo: false
        })
        this.onChange(this.state.formControls.contacts.value, 'contacts')
    }


    renderContacts(controlName, control) {
        return (
            <React.Fragment>
                <div className={classes.Wrap}>
                    <ul className={classes.list_textBlock}>
                        {
                            control.value.map((one, i) => {
                                return (
                                    <li className={classes.One} key={i}>
                                        {
                                            <svg
                                                onClick={() => this.deleteContact(i)} 
                                                className={classes.deleteSvg} 
                                                viewBox="0 0 40 40" width="1em" height="1em"
                                            >
                                                <path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z">
                                                </path>
                                            </svg>
                                        }
                                        { <a href={one.href} target="_blank">  { one.title } </a> }
                                        {/* { <a href={one.href} target="_blank">  { one.title } </a> } */}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </React.Fragment>
        )
    }

    renderInputs() {
        function isInvalid({valid, touched, shouldValidate}) {
            return !valid && shouldValidate && touched
        }
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
            const cls = [classes.Input]
            const htmlFor = index+'_'+Math.random()
            const shouldValidate=!!control.validation
            const valid = control.valid
            const touched = control.touched
            if (isInvalid({valid, touched, shouldValidate })) {
                cls.push(classes.invalid)
            }
            return (
                <div className={cls.join(' ')} key={index}>
                    <label htmlFor={htmlFor}>{control.label}</label>
                    {
                        control.type === 'contacts'
                            ? this.renderContacts(controlName, control)
                            : null
                    }
                    {
                        isInvalid({valid, touched, shouldValidate })
                            ? <span>{control.errorMessage || 'Enter right value'}</span>
                            : null
                    }
                </div>
            )
        })
    }

    renderModalAddContacts() {
        if (this.state.showModalAddVideo) {
            return (
                <React.Fragment>
                    <Backdrop zIndex={"101"} onClick={() => this.setState({showModalAddVideo: false})} />
                    <div style={{zIndex: "102"}} className={classes.modalVideoWrap}>
                        <div>
                            <div className={classes.Input} >
                                <input id="addTitle" placeholder="Название" />
                            </div>
                            <div className={classes.Input} >
                                <input id="addHref" placeholder="Ссылка" />
                            </div>
                            <div>
                                <Button
                                    type='success'
                                    onClick={()=> this.addContact(document.querySelector('#addTitle').value, document.querySelector('#addHref').value)}
                                >
                                    OK
                                </Button>
                                <Button
                                    type='success'
                                    onClick={()=> this.setState({showModalAddVideo: false})}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }
    
    render() {
        if (this.props.createUpdateView === 'update') {
            return (
                <React.Fragment>
                    { this.renderModalAddContacts() }
                    <div className={classes.Creator}>
                        <div>
                            <form 
                                className={classes.formCreate}
                                onSubmit={(event) => event.preventDefault()} 
                            >
                                {
                                    this.props.loading
                                        ? <Loader />
                                        : this.renderInputs()
                                }
                                <div className={classes.btnCreate}>
                                    <Button
                                        type='success'
                                        onClick={this.save}
                                        disabled={!this.state.isFormValid}
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        type='success'
                                        onClick={() => this.setState({showModalAddVideo: true})}
                                        // disabled={!this.state.isFormValid}
                                    >
                                        Добавить
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        if (this.props.createUpdateView === 'view') {
            return (
                <div className={classes.Post}>
                    {
                        this.state.loader
                            ? <Loader />
                            : <div className={classes.Wrap}>
                                <ul className={classes.list_textBlock}>
                                    {
                                        this.state.formControls.contacts.value.map((one, i) => {
                                            return (
                                                <li className={classes.One} key={i}>
                                                    { <a href={one.href} target="_blank">  { one.title } </a> }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                    }
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        contacts: state.contacts
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAll: () => dispatch(getAll()),
        updateOne: (id, formData, formDataForLocalUpdate) => dispatch(updateOne(id, formData, formDataForLocalUpdate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)