import React, {Component} from 'react'
import classes from './index.module.css'
import Loader from '../../components/UI/loader'
import Button from '../../components/UI/button'
import Backdrop from '../../components/UI/backdrop'
import {connect} from 'react-redux'
import {getAll} from '../../store/actions/how/all'
import {updateOne} from '../../store/actions/how/update'

class Home extends Component {

    state = {
        video: {
            width: 0,
            height: 0
        },
        showModalAddVideo: false,
        loader: false,
        isFormValid: false,
        formControls: {
            video: {
                value: "", // `https://www.youtube.com/watch?v=-3P2USPFDcE watch?v=`  embed/
                type: 'video',
                label: 'Видео',
                errorMessage: 'Добавьте видео',
                valid: true,
                touched: true,
                validation: false
            },
            descr: {
                value: ``,
                type: 'textEditor',
                label: 'Описание',
                errorMessage: 'Введите корректное описание',
                valid: true,
                touched: true,
                validation: false
            }
        }
    }


    async componentDidMount() {
        this.setState({loader: true})
        if (!this.props.how.all.descr && !this.props.how.all.video) {
            await this.props.getAll()
        }
        let formControls = {...this.state.formControls}
        if (this.props.how.all.descr) { formControls.descr.value = this.props.how.all.descr }
        if (this.props.how.all.video) { formControls.video.value = this.props.how.all.video }
        // console.log(this.props.how.all)
        this.setState({formControls})
        this.setState({loader: false})
        // console.log(this.state)
        this.resizeVideo()
        window.addEventListener("orientationchange", this.resizeVideo(), false);
    }

    componentWillUnmount() {
        window.removeEventListener("orientationchange", this.resizeVideo(), false)
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
        if (controlName !== 'descr') {formControls[controlName].value = value}
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

    makeArrTextEditor = () => {
        const descrArr = []
        const q = document.querySelector('#textBox').cloneNode(true)

        if (q.children.length) {
            for (let i=q.children.length-1; i>=0; i--) {
                if (q.children[i].textContent) {
                    descrArr.unshift({ 
                        textContent: q.children[i].textContent,
                        textAlign: document.querySelector('#textBox').children[i].style.textAlign
                    })
                } else {
                    descrArr.unshift({ br: true })
                }
                q.children[i].remove()
            }    
        }
        if (q.textContent) {
            descrArr.unshift({ textContent: q.textContent })
        }
        let isEmptyDescrArr = true
        for (let waw in descrArr) {
            if (descrArr[waw].textContent) {
                isEmptyDescrArr = false
                break
            }
        }
        if (isEmptyDescrArr) { 
            return []
        }
        return descrArr
    }

    save = async () => {
        // return console.log(this.state.formControls.video.value)
        if (!this.props.token) { return alert('no authorization') }
        let formDataForLocalUpdate = {
            "descr": JSON.stringify(this.makeArrTextEditor()),
            "video": this.state.formControls.video.value
        }
        var formData = new FormData();
        await formData.append("descr", formDataForLocalUpdate["descr"])
        await formData.append("video", formDataForLocalUpdate["video"])
        if (this.props.createUpdateView === 'update') {
            await this.props.updateOne(null, formData, formDataForLocalUpdate)
            this.setState({isFormValid: false})
        }
    }


    resizeVideo = () => {
        let video = {...this.state.video}
        if (window.innerHeight >= window.innerWidth) {
            video.width = 0.95*window.innerWidth
            video.height = 0.95*window.innerWidth*158/280
        }
        if (window.innerHeight < window.innerWidth) {
            video.width = 0.95*window.innerWidth
            video.height = 0.95*window.innerWidth*158/280
            if (video.height > window.innerHeight) {
                video.height = 0.95*window.innerHeight
                video.width = 0.95*window.innerHeight*280/158
            }
        }
        this.setState({video})
    }

    deleteVideo = () => {
        let newFormControls = this.state.formControls
        newFormControls.video.value = ``
        this.setState({
            formControls: newFormControls
        })
        this.onChange(this.state.formControls.video.value, 'video')
    }

    addVideo = (srcVid) => {
        let newFormControls = this.state.formControls
        newFormControls.video.value = srcVid.replace('watch?v=', 'embed/')
        this.setState({
            formControls: newFormControls,
            showModalAddVideo: false
        })
        this.onChange(this.state.formControls.video.value, 'video')
    }


    renderVideo(controlName, control) {
        if (control.value) {
            return (
                <div className={classes.littleImg_wrap}> 
                    <svg
                        onClick={() => this.deleteVideo()} 
                        className={classes.deleteSvg} 
                        viewBox="0 0 40 40" width="1em" height="1em"
                    >
                        <path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z">
                        </path>
                    </svg>
                    <iframe src={control.value} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} frameBorder="100"></iframe>
                </div>
            )
        }
        if (!control.value) {
            return (
                <div className={classes.littleImg_wrap}>
                    <div 
                        className={classes.dragAndDrop}
                        onClick={() => this.setState({showModalAddVideo: true})}
                    >
                        <div className={classes.addVideo}>+</div>
                    </div>
                </div>
            )
        }
    }

    renderTextEditor(controlName, control) {
        return (
            <div className={classes.divTextEditor} >
                <input type="hidden" name="myDoc" />
                <div className={classes.toolBar2}>
                    <img className="intLink" title="Выровнять слева" onClick={ () => document.execCommand('justifyleft', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />
                    <img className="intLink" title="Выровнять центр" onClick={() => document.execCommand('justifycenter', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />
                    <img className="intLink" title="Выровнять справа" onClick={() => document.execCommand('justifyright', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />
                </div>
                <div
                    onInput = {e => {this.onChange(document.querySelector('#textBox').textContent, 'descr')}}
                    className={classes.textBox} 
                    id="textBox" 
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    >
                {
                    this.state.formControls.descr.value
                        ? JSON.parse(this.state.formControls.descr.value).map((obj, i) => {
                            return (
                                <div key={i} style={{ textAlign: obj.textAlign ? obj.textAlign : '' }} >{ obj.textContent }</div>
                            )
                        })
                        : null
                }

                </div>
            </div>
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
                        control.type === 'textEditor'
                            ? this.renderTextEditor(controlName, control)
                            : control.type === 'video'
                                ? this.renderVideo(controlName, control)
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

    renderModalAddVideo() {
        if (this.state.showModalAddVideo) {
            return (
                <React.Fragment>
                    <Backdrop zIndex={"101"} onClick={() => this.setState({showModalAddVideo: false})} />
                    <div style={{zIndex: "102"}} className={classes.modalVideoWrap}>
                        <div>
                            <div className={classes.Input} >
                                <input id="addVideo" placeholder="Ссылка на видео youtube" />
                            </div>
                            <div>
                                <Button
                                    type='success'
                                    onClick={()=> this.addVideo(document.querySelector('#addVideo').value)}
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
                    { this.renderModalAddVideo() }
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
                            : <div>
                                <div>
                                    {
                                        this.state.formControls.video.value
                                        ? <div className={classes.wrap_big_img}>
                                            <iframe width={ this.state.video.width } height={ this.state.video.height } src={this.state.formControls.video.value} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} frameBorder="100"></iframe>
                                        </div> : null    
                                    }
                                </div>
                                <div className={classes.Wrap}>
                                    <ul className={classes.list_textBlock}>
                                        {
                                            this.state.formControls.descr.value 
                                            ? JSON.parse(this.state.formControls.descr.value).length
                                                ? <div className={classes.PostWrapper}>
                                                    { 
                                                        JSON.parse(this.state.formControls.descr.value).map((obj, i) => {
                                                            return (
                                                                <li className={classes.One} key={i} style={{ textAlign: obj.textAlign ? obj.textAlign : '' }} >
                                                                    { obj.textContent }
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                : null
                                            : null
                                        }
                                    </ul>
                                </div>
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
        how: state.how
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAll: () => dispatch(getAll()),
        updateOne: (id, formData, formDataForLocalUpdate) => dispatch(updateOne(id, formData, formDataForLocalUpdate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)