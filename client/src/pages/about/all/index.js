import React, {Component} from 'react'
import classes from './index.module.css'
import Loader from '../../../components/UI/loader'
import Button from '../../../components/UI/button'
import Backdrop from '../../../components/UI/backdrop'
import {connect} from 'react-redux'
import {getAll} from '../../../store/actions/about/all'
import {updateOne} from '../../../store/actions/about/update'

class All extends Component {
    
    state = {
        loader: false,
        video: {
            width: 0,
            height: 0
        },
        createUpdateView: '',
        showModalAddVideo: false,
        isFormValid: false,
        formControls: {
            video: {
                value: ``, // `https://www.youtube.com/watch?v=-3P2USPFDcE watch?v=`  embed/
                type: 'video',
                label: 'Видео',
                errorMessage: 'Добавьте видео',
                valid: true,
                touched: false,
                validation: false
            },
            descr: {
                value: '',
                type: 'textEditor',
                label: 'Описание',
                errorMessage: 'Введите корректное описание',
                valid: true,
                touched: false,
                validation: false
            }
        }
    }

    async componentDidMount() {
        // console.log(this.props.all)
        this.setState({loader: true})
        if (this.props.all.length === 0) { await this.getListArr_start_Limit() }
        let newState = {...this.state}
        for (let asda in this.props.all) {
            if (this.props.all[asda].id === '0') {
                newState.formControls.video.value = this.props.all[asda].video 
                newState.formControls.descr.value = this.props.all[asda].descr 
            }
        }
        this.setState({loader: false})
        this.resizeVideo()
        window.addEventListener("orientationchange", this.resizeVideo(), false);
    }

    componentWillUnmount() {
        window.removeEventListener("orientationchange", this.resizeVideo(), false)
    }

    getListArr_start_Limit = async () => {
        if (!this.props.showMore) { return }
        let _start = this.props.all.length
        let _limit = 24
        await this.props.getAll(_start, _limit)
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

    createPrevStr(descr) {
        let prevStr = ''
        let pars_descr = JSON.parse(descr)
        for (let num_descr in pars_descr) {
            prevStr = prevStr + ' ' + pars_descr[num_descr].textContent
            if (prevStr.length > 100) {
                prevStr.slice(0, 100)
            }
        }
        return prevStr
        // return prevStr+'...'
    }

    


        
    validateControl(value, validation) {
        if (!validation) {
            return true
        }
        if (validation.requiredImg) {
            if (!value.length) {
                return false
            }
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
    onChange = (value, controlName) => {
        const formControls = {...this.state.formControls}
        formControls[controlName].touched = true
        if (controlName !== 'descr') {formControls[controlName].value = value}
        for (let formC in formControls) {
            if (this.state.createUpdateView === 'update') { formControls[formC].touched = true }
            formControls[formC].valid = this.validateControl(formControls[formC].value, formControls[formC].validation)
        }
        let isFormValid = true
        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })
        this.setState({formControls, isFormValid})
    }

    makeArrTextEditor = () => {
        var descrArr = []
        var q = document.querySelector('#textBoxAll').cloneNode(true)

        if (q.children.length) {
            for (let i=q.children.length-1; i>=0; i--) {
                if (q.children[i].textContent) {
                    descrArr.unshift({ 
                        textContent: q.children[i].textContent,
                        textAlign: document.querySelector('#textBoxAll').children[i].style.textAlign
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
        // console.log(descrArr)
        return descrArr
    }

    save = async () => {
        if (!this.props.token) {
            return alert('no authorization')
        }
        var formData = new FormData();
        let formDataForLocalUpdate = {
            "video": this.state.formControls.video.value,
            "descr": JSON.stringify(this.makeArrTextEditor()),
        }
        if (formDataForLocalUpdate["video"]) {
            formData.append("video", formDataForLocalUpdate["video"])
        } else {
            formData.append("video", "")
        }
        
        await formData.append("descr", formDataForLocalUpdate["descr"])
        
        if (this.props.createUpdateView === 'update') {
            await this.props.updateOne("0", formData, formDataForLocalUpdate)
            this.setState({isFormValid: false})
        }
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
    
    isInvalid({valid, touched, shouldValidate}) {
        return !valid && shouldValidate && touched
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


    renderVideo = () => {
        const shouldValidate=!!this.state.formControls.video.validation
        const valid = this.state.formControls.video.valid
        const touched = this.state.formControls.video.touched
        const cls = [classes.Input]
        if (this.isInvalid({valid, touched, shouldValidate })) {
            cls.push(classes.invalid)
        }
        return (
            <div className={cls.join(' ')} >
                <div className={classes.littleImg_wrap}>
                    <label style={{ "color": "#fff" }} >{this.state.formControls.video.label}</label>
                </div>
                {
                    this.state.formControls.video.value
                        ? <div className={classes.littleImg_wrap}> 
                            <svg
                                onClick={() => this.deleteVideo()} 
                                className={classes.deleteSvg} 
                                viewBox="0 0 40 40" width="1em" height="1em"
                            >
                                <path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z">
                                </path>
                            </svg>
                            <iframe src={this.state.formControls.video.value} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} frameBorder="100"></iframe>
                        </div>
                        : <div className={classes.littleImg_wrap}>
                            <div 
                                className={classes.dragAndDrop}
                                onClick={() => this.setState({showModalAddVideo: true})}
                            >
                                <div className={classes.addVideo}>+</div>
                            </div>
                        </div>
                    }
                    {
                        this.isInvalid({valid, touched, shouldValidate })
                            ? <span>{this.state.formControls.video.errorMessage || 'Enter right value'}</span>
                            : null
                    }
            </div>
        )
    }

    renderTextEditor() {
        const shouldValidate=!!this.state.formControls.video.validation
        const valid = this.state.formControls.video.valid
        const touched = this.state.formControls.video.touched
        const cls = [classes.Input]
        if (this.isInvalid({valid, touched, shouldValidate })) {
            cls.push(classes.invalid)
        }
        return (
            <div className={cls.join(' ')} >
                <div className={classes.littleImg_wrap}>
                    <label style={{ "color": "#fff" }} >{this.state.formControls.video.label}</label>
                </div>
                <div className={classes.divTextEditor} >
                    <input type="hidden" name="myDoc" />
                    <div className={classes.toolBar2}>
                        <img className="intLink" title="Выровнять слева" onClick={ () => document.execCommand('justifyleft', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />
                        <img className="intLink" title="Выровнять центр" onClick={() => document.execCommand('justifycenter', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />
                        <img className="intLink" title="Выровнять справа" onClick={() => document.execCommand('justifyright', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />
                    </div>
                    <div
                        onInput = {e => {this.onChange(document.querySelector('#textBoxAll').textContent, 'descr')}}
                        className={classes.textBox} 
                        id="textBoxAll" 
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
            </div>
        )
    }
    
    render() {
        if (this.props.createUpdateView === 'update') {
            return (
                <React.Fragment>
                    { this.renderModalAddVideo() }
                    <div className={classes.Post}>
                        <div className={classes.PostWrapper}>
                                <h1>Обо мне</h1>
                                        {this.renderVideo()}
                                        <div className={classes.list}>
                                            {
                                                this.props.all.map((one, i) => {
                                                    if (one.id !== '0') {
                                                        // console.log(one.descr)
                                                        return (
                                                            <div className={classes.cardWrap} key={i}>
                                                                {/* {console.log(this.props)} */}
                                                                <div 
                                                                    onClick={() => this.props.state.history.push(`${this.props.isAdmin ? '/admin' : ''}/about/${one.id}`)}
                                                                    className={classes.list__card}
                                                                >
                                                                    {one.isPreview
                                                                        ? <img src={`${this.props.url.isDev ? (this.props.url.dev.url+this.props.url.dev.clientPort) : this.props.url.url }/img/about/${one.id}/preview.jpg`} />
                                                                        : null
                                                                    }
                                                                    <div>
                                                                        <h4>{one.title}</h4>
                                                                        {   
                                                                            JSON.parse(one.descr).length 
                                                                                ? <p>{this.createPrevStr(one.descr)}</p> : null
                                                                        }
                                                                        {/* <h6>подробнее</h6> */}
                                                                    </div>
                                                                </div>   


                                                                {
                                                                    this.props.isAdmin
                                                                        ?  <div className={classes.buttonWrap}>
                                                                                {/* <Button
                                                                                    type='success'
                                                                                    onClick={() => this.props.deleteOne(one.id)}
                                                                                    // disabled={!this.state.isFormValid}
                                                                                >
                                                                                    Удалить
                                                                                </Button> */}
                                                                                <Button
                                                                                    type='success'
                                                                                    onClick={() => this.props.state.history.push(`/admin/about/update/${one.id}`)}
                                                                                >
                                                                                    Редактировать
                                                                                </Button>
                                                                            </div>
                                                                        : null
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                        {this.renderTextEditor()}
                                        <div className={classes.wrapShowMore}>
                                            {
                                                this.state.loader
                                                    ? <Loader />
                                                    : <div className={classes.buttonWrap}>
                                                        <Button
                                                            type='success'
                                                            onClick={() => this.save()}
                                                            disabled={!this.state.isFormValid }
                                                        >
                                                            Сохранить
                                                        </Button>
                                                    </div>
                                            }
                                    </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        if (this.props.createUpdateView === 'view') {
            // console.log(this.props.createUpdateView )
            return (
                <div className={classes.Post}>
                    {/* <div 
                        className={classes.btnGoBack}
                        onClick={() => this.props.state.history.goBack()}
                    >
                        <svg viewBox="0 0 60 32" width="1em" height="1em"><path fill="#fff" d="M53 17.5H13.7l8.4 8.4L20 28 8 16 20 4l2.1 2.1-8.4 8.4H53z"></path></svg>
                    </div> */}
                    {
                            this.props.loading
                                ? <Loader />
                                : <div className={classes.PostWrapper}>
                                    <h1>Обо мне</h1>
                                    <div>
                                        {
                                            this.state.formControls.video.value
                                            ? <div className={classes.wrap_big_img}>
                                                <iframe width={ this.state.video.width } height={ this.state.video.height } src={this.state.formControls.video.value} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} frameBorder="100"></iframe>
                                            </div> : null    
                                        }
                                    </div>
                                    <div className={classes.list}>
                                        {
                                            this.props.all.map((one, i) => {
                                                if (one.id !== '0') {
                                                    // console.log(one.descr)
                                                    return (
                                                        <div className={classes.cardWrap} key={one.id}>
                                                            {/* {console.log(this.props)} */}
                                                            <div 
                                                                onClick={() => this.props.state.history.push(`${this.props.isAdmin ? '/admin' : ''}/about/${one.id}`)}
                                                                className={classes.list__card}
                                                            >
                                                                {one.isPreview
                                                                    ? <img src={`${this.props.url.isDev ? (this.props.url.dev.url+this.props.url.dev.clientPort) : this.props.url.url }/img/about/${one.id}/preview.jpg`} />
                                                                    : null
                                                                }
                                                                <div>
                                                                    <h4>{one.title}</h4>
                                                                    {   
                                                                        JSON.parse(one.descr).length 
                                                                            ? <p>{this.createPrevStr(one.descr)}</p> : null
                                                                    }
                                                                    {/* <h6>подробнее</h6> */}
                                                                </div>
                                                            </div>   
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                    
                                    { 
                                        this.state.formControls.descr.value 
                                            ? JSON.parse(this.state.formControls.descr.value).length
                                                ? <div className={classes.descr}>
                                                    { 
                                                        JSON.parse(this.state.formControls.descr.value).map((obj, i) => {
                                                            return (
                                                                <p key={i} style={{ textAlign: obj.textAlign ? obj.textAlign : '' }} >{ obj.textContent }</p>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                : null
                                            : null
                                    }
                                </div>
                        }
                    </div>
            )
        }


    }
}

function mapStateToProps(state) {
    return {
        url: state.config.url,
        showMore: state.about.showMore,
        all: state.about.all,
        token: state.auth.token,
        isAdmin: state.config.isAdmin
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateOne: (id, formData, formDataForLocalUpdate) => dispatch(updateOne(id, formData, formDataForLocalUpdate)),
        getAll: (_start, _limit) => dispatch(getAll(_start, _limit))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(All)