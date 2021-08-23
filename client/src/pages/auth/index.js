import React, {Component} from 'react'
import {connect} from 'react-redux'
import classes from './index.module.css'
import Button from '../../components/UI/button'
import Input from '../../components/UI/input'
import {actionRegister, actionLogin} from '../../store/actions/auth'

class Auth extends Component {

    state = {
        isFormValid: false,
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный email',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите корректный пароль',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 8
                }
            }
        }
    }

    login = () => {
        const formData = {
            email: this.state.formControls.email.value,
            pass: this.state.formControls.password.value
        }
        this.props.authLogin(formData)
    }

    register = () => {
        const formData = {
            email: this.state.formControls.email.value,
            pass: this.state.formControls.password.value
        }
        this.props.authRegister(formData)
    }

    submit = event => {
        event.preventDefault()
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

        if (validation.email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(value)){
                return false
            }
        }

        if (validation.minLength) {
            if (value.trim().length < 8) {
                return false
            }
        }

        return true

    }

    onChange = (event, controlName) => {
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}
        
        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation)

        formControls[controlName] = control

        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({
            formControls, isFormValid
        })
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    shouldValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => this.onChange(event, controlName)}
                />
            )
        })
    }
    
    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={this.submit} className={classes.AuthForm}> 
                        
                        { this.renderInputs() }

                        <Button
                            type='success'
                            onClick={this.login}
                            disabled={!this.state.isFormValid}
                            >
                            Войти
                        </Button>
                        {/* <Button
                            type='primary'
                            onClick={this.register}
                            disabled={!this.state.isFormValid}
                        >
                            Зарегистрироваться
                        </Button> */}
                    </form>
                </div>
            </div>
        )
    }
}

// function mapStateToProps(state) {
//     return {
//         // quiz: state.create.quiz
//     }
// }

function mapDispatchToProps(dispatch) {
    return {
        authRegister: formData => dispatch(actionRegister(formData)),
        authLogin: formData => dispatch(actionLogin(formData))
        // createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        // finishCreateQuiz: () => dispatch(finishCreateQuiz())
    }
}

export default connect(null, mapDispatchToProps)(Auth)