import React, {Component} from 'react'
import classes from './index.module.css'
import Button from '../../../components/UI/button'
import Backdrop from '../../../components/UI/backdrop'
import Loader from '../../../components/UI/loader'
import ResizeImg from '../../../components/resizeImg'
import {connect} from 'react-redux'
import {createOne} from '../../../store/actions/services/create'
import {updateOne} from '../../../store/actions/services/update'

class Create extends Component {
    state = {
        video: {
            width: 0,
            height: 0
        },
        createUpdateView: '',
        showModalAddVideo: false,
        resizeImgIdInput: '',
        showCanvas: false,
        isFormValid: false,
        titlePage: ``,
        bigImg: ``,
        amountFiles: '0',
        formControls: {
            title: {
                value: '',
                type: 'text',
                label: 'Title',
                errorMessage: 'Введите корректный title',
                valid: false,
                touched: false,
                validation: {
                    required: true
                }
            },
            preview: {
                isPreview: '',
                value: ``,
                type: 'preview',
                label: 'Превью',
                errorMessage: 'Добавьте превью',
                valid: false,
                touched: false,
                validation: false
            },
            img: {
                value: [],
                type: 'imgArr',
                label: 'Картинки',
                errorMessage: 'Добавьте картинку',
                valid: true,
                touched: true,
                validation: false
            },
            video: {
                value: ``, // `https://www.youtube.com/watch?v=-3P2USPFDcE watch?v=`  embed/
                type: 'video',
                label: 'Видео',
                errorMessage: 'Добавьте видео',
                valid: true,
                touched: true,
                validation: false
            },
            descr: {
                value: '',
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
        if (this.props.createUpdateView === 'create') { this.setState({titlePage: 'Создание'}) }
        if (this.props.createUpdateView === 'update') { this.setState({titlePage: 'Изменение'}) }
        if (this.props.createUpdateView === 'update' || this.props.createUpdateView === 'view') {
            let one = await this.props.all.find((oneObj) => oneObj.id === this.props.state.match.params.id)
            if (!one) {
                const url = `${this.props.config.url.isDev ? (this.props.config.url.dev.url+this.props.config.url.dev.serverPort) : this.props.config.url.url }/api/services/${this.props.state.match.params.id}`
                let headers = {"Content-Type": "application/json; charset=utf-8"}
                if (this.props.config.isAdmin) {
                    headers["Token"] = this.props.auth.token
                }
                const response = await fetch(url, {
                    method: 'GET',
                    headers
                })
                one = await response.json()
            }
            const formControls = {...this.state.formControls}
            for (let fc in formControls) {
                for (let on in one) {
                    if (fc === on) {
                        formControls[fc].value = one[on]
                    }
                }     
            }
            formControls.preview.isPreview = one.isPreview
            this.setState({
                id: this.props.state.match.params.id,
                amountFiles: one.amountFiles,
                formControls,
                createUpdateView: this.props.createUpdateView
            })
            await this.createAndPushImgAndPreviewBase64()
        }
        this.resizeVideo()
        window.addEventListener("orientationchange", this.resizeVideo(), false);
    }

    componentWillUnmount() {
        window.removeEventListener("orientationchange", this.resizeVideo(), false)
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

    createAndPushImgAndPreviewBase64 = async () => {
        async function getBase64Image(img) {
            var canvasIZ = document.createElement("canvas");
            canvasIZ.width = img.width;
            canvasIZ.height = img.height;
            var ctxIZ = canvasIZ.getContext("2d");
            await ctxIZ.drawImage(
                img, 
                0, 0, img.width, img.height,
                0, 0, img.width, img.height
            );
            return await canvasIZ.toDataURL('image/jpeg', 1.0)
        }
        let onloadImgFunc = async (name) => {
            var img = new Image();
            img.onload = () => {
                let initOnloadImg = async () => {
                    let state = {...this.state}
                    let base64Image = await getBase64Image(img)
                    if (name === 0) { state.bigImg = base64Image }
                    if (typeof name === 'number') { state.formControls.img.value.push(base64Image) }
                    if (name === 'preview') { state.formControls.preview.value = base64Image }
                    this.setState(state)
                }
                initOnloadImg()
            }
            img.src = `${this.props.url.isDev ? (this.props.url.dev.url+this.props.url.dev.clientPort) : this.props.url.url }/img/services/${this.state.id}/${name}.jpg`
        }
        for (let am_i=0; am_i < Number(this.state.amountFiles); am_i++) {
            await onloadImgFunc(am_i)
        }
        if (this.props.createUpdateView === 'update') { await onloadImgFunc('preview') }
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
        if (!this.props.token) {
            return alert('no authorization')
        }
        var formData = new FormData();
        for (let i_img in this.state.formControls.img.value) {
            await dataUrlAppendToFormData(this.state.formControls.img.value[i_img], i_img+'.jpg')
        }
        if (this.state.formControls.preview.value) {
            await dataUrlAppendToFormData(this.state.formControls.preview.value, 'preview.jpg')
        }
        async function dataUrlAppendToFormData(dataUrl, nameImg) {
            var ImageURL = dataUrl
            var block = await ImageURL.split(";");
            var contentType = await block[0].split(":")[1];// In this case "image/gif"
            var realData = await block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
            var blob = await b64toBlob(realData, contentType);
            formData.append(nameImg, blob, nameImg);
        }
        async function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = await atob(b64Data);
            var byteArrays = [];
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = await byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = await new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = await slice.charCodeAt(i);
                }
                var byteArray = await new Uint8Array(byteNumbers);
                await byteArrays.push(byteArray);
            }
            var blob = await new Blob(byteArrays, {type: contentType});
            return blob;
        }
        
        let formDataForLocalUpdate = {
            "amountFiles": this.state.formControls.img.value.length,
            "title": this.state.formControls.title.value,
            "video": this.state.formControls.video.value,
            "descr": JSON.stringify(this.makeArrTextEditor()),
            "isPreview": this.state.formControls.preview.isPreview
        }
        formData.append("amountFiles", formDataForLocalUpdate["amountFiles"])
        formData.append("title", formDataForLocalUpdate["title"])
        formData.append("video", formDataForLocalUpdate["video"])
        formData.append("isPreview", formDataForLocalUpdate["isPreview"])
        await formData.append("descr", formDataForLocalUpdate["descr"])
        if (this.props.createUpdateView === 'update') {
            await this.props.updateOne(this.props.state.match.params.id, formData, formDataForLocalUpdate)
            this.setState({isFormValid: false})
        }
        if (this.props.createUpdateView === 'create') {
            await this.props.createOne(formData)
            // clear state
            let formControls = await {...this.state.formControls}
            formControls.preview.isPreview = ``
            document.querySelector('#textBox').innerHTML = ''
            for (let foCo in formControls) {
                await clearValue(foCo, formControls)
            }
            function clearValue(foCo, formControls) {
                if (foCo === 'img') {
                    formControls[foCo].value = []
                } else if (foCo === 'descr') {
                    formControls[foCo].value = '[]'
                } else {
                    formControls[foCo].value = ''
                }
                if (foCo === 'title' || foCo === 'preview') {
                    formControls[foCo].valid = false
                    formControls[foCo].touched = false
                }
            }
            this.setState({
                formControls,
                bigImg: ``,
                amountFiles: '0',
                isFormValid: false
            })
        }
    }

    changeBigImg = (imgSrc) => {
        this.setState({bigImg: imgSrc})
    }

    pushInStateImg = imgSrc => {
        let newFormControls = {...this.state.formControls}
        newFormControls.img.value.push(imgSrc)
        let newBigImg = ''
        if (!this.state.bigImg) {
            newBigImg = newFormControls.img.value[0]
        } else {
            newBigImg = this.state.bigImg
        }
        this.setState({
            bigImg: newBigImg,
            formControls: newFormControls
        })
        this.onChange(this.state.formControls.img.value, 'img')
    }
    deleteImg = i => {
        let newFormControls = {...this.state.formControls}
        let bigImgDel = this.state.formControls.img.value.find((val, index) => index === i)
        let newArrImage = this.state.formControls.img.value.filter((val, index) => index !== i)
        newFormControls.img.value = newArrImage
        let newBigImg = this.state.bigImg
        if (newArrImage.length && this.state.bigImg === bigImgDel) {
            newBigImg = newArrImage[0]
        }
        if (!newArrImage.length) {
            newBigImg = ''
        }
        this.setState({
            bigImg: newBigImg,
            formControls: newFormControls
        })
        this.onChange(this.state.formControls.img.value, 'img')

    }
    deletePreview = () => {
        let newFormControls = this.state.formControls
        newFormControls.preview.value = ``
        newFormControls.preview.isPreview = ``
        this.setState({
            formControls: newFormControls
        })
        this.onChange(this.state.formControls.preview.value, 'preview')
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
    
    resizeResponse = (imgSrcRes) => {
        document.querySelector('#'+this.state.resizeImgIdInput).value = ''
        this.setState({showCanvas: false})
        if ('fileElem' === this.state.resizeImgIdInput) {
            this.pushInStateImg(imgSrcRes)
        }
        if ('preview' === this.state.resizeImgIdInput) {
            let newFormControls = {...this.state.formControls}
            newFormControls.preview.value = imgSrcRes
            newFormControls.preview.isPreview = 'true'
            this.setState({
                formControls: newFormControls
            })
            this.onChange(imgSrcRes, 'preview')
        }
    }

    
    renderVideo(controlName, control) {
        if (control.value) {
            return (
                <div className={classes.littleImg_wrap}> 
                    {
                        this.props.isAdmin
                            ? <svg
                                onClick={() => this.deleteVideo()} 
                                className={classes.deleteSvg} 
                                viewBox="0 0 40 40" width="1em" height="1em"
                            >
                                <path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z">
                                </path>
                            </svg>
                            : null
                    }
                    <iframe src={control.value} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} frameBorder="100"></iframe>
                </div>
            )
        }
        if (this.props.isAdmin) {
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


    renderPreview(controlName, control) {
        return (
            <div className={classes.dragAndDrop_wrap}>
                <div>
                    {control.value 
                        ? <svg
                            onClick={() => this.deletePreview()} 
                            className={classes.deleteSvg} 
                            viewBox="0 0 40 40" width="1em" height="1em"
                        >
                            <path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z">
                            </path>
                        </svg> : null}
                        {control.value 
                        ? <img 
                            width="250px" height="333px" 
                            src={control.value} 
                        /> : null}
                </div>
                <div className={classes.littleImg_wrap}>
                    {this.props.isAdmin && !control.value  
                        ? <div className={classes.dragAndDrop}>
                            <input 
                                type="file" 
                                id="preview" 
                                onChange={() => this.setState({showCanvas: true, resizeImgIdInput: 'preview'})}
                                accept="image/jpeg, image/png" />
                            <label htmlFor="preview">+</label>
                        </div> 
                        : null}
                </div>
            </div>
        )
    }
    
    renderImgArr(controlName, control) {
        return (
            <div className={classes.dragAndDrop_wrap}>
                <div>
                    {this.state.bigImg ? <img 
                    width="250px" height="333px" 
                    src={this.state.bigImg} /> : null}
                </div>
                <div className={classes.littleImg_wrap}>
                    {control.value.map((imgSrc, i) => {
                        return (
                                <div 
                                    key={i}
                                    className={classes.littleImg}
                                >
                                    <svg
                                        onClick={() => this.deleteImg(i)} 
                                        className={classes.deleteSvg} 
                                        viewBox="0 0 40 40" width="1em" height="1em"
                                    >
                                        <path d="M20 18.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4 1.4-1.4z">
                                        </path>
                                    </svg>
                                    <img 
                                        onClick={() => this.changeBigImg(imgSrc)} 
                                        src={imgSrc} 
                                    />
                                </div>
                            )
                        })
                    }
                    {this.props.isAdmin 
                        ? <div className={classes.dragAndDrop}>
                            <input 
                                type="file" 
                                id="fileElem" 
                                onChange={() => this.setState({showCanvas: true, resizeImgIdInput: 'fileElem'})}
                                accept="image/jpeg, image/png" />
                            <label htmlFor="fileElem">
                                {/* <div> */}
                                    +
                                {/* </div> */}
                            </label>
                        </div> 
                        : null}
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
                        control.type === 'text'
                            ?  <input
                                    type={'text'}
                                    id={htmlFor}
                                    value={control.value}
                                    onChange={event => this.onChange(event.target.value, controlName)}
                                />
                            : control.type === 'preview'
                                ? this.renderPreview(controlName, control)
                            : control.type === 'imgArr'
                                ? this.renderImgArr(controlName, control)
                                : control.type === 'video'
                                    ? this.renderVideo(controlName, control)
                                    : control.type === 'textEditor'
                                        ? <div className={classes.divTextEditor} >
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
        if (this.props.createUpdateView === 'create' || this.props.createUpdateView === 'update') {
            return (
                <React.Fragment>
                    { this.renderModalAddVideo() }
                    <div 
                        className={classes.resizeImg_wrap}
                        style={ this.state.showCanvas ? { display: "block" } : { display: "none" } }>
                        <ResizeImg
                            resizeResponse={this.resizeResponse}
                            idOfInput={this.state.resizeImgIdInput}
                            // idOfInput={"fileElem"} 
                            showCanvas={this.state.showCanvas} 
                        />
                    </div>
                    <div style={ this.state.showCanvas ? { display: "none" } : { display: "block" } }>
                        <div 
                            className={classes.btnGoBack}
                            onClick={() => this.props.state.history.goBack()}
                        >
                            <svg viewBox="0 0 60 32" width="1em" height="1em"><path fill="#fff" d="M53 17.5H13.7l8.4 8.4L20 28 8 16 20 4l2.1 2.1-8.4 8.4H53z"></path></svg>
                        </div>
                        <div className={classes.QuizCreator}>
                            <div>
                                {this.state.titlePage ? <h1>{this.state.titlePage}</h1> : null}
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
                    </div>
                </React.Fragment>
            )
        }
        if (this.props.createUpdateView === 'view') {
            // console.log(this.props.createUpdateView )
            return (
                <div className={classes.Post}>
                    <div 
                        className={classes.btnGoBack}
                        onClick={() => this.props.state.history.goBack()}
                    >
                        <svg viewBox="0 0 60 32" width="1em" height="1em"><path fill="#fff" d="M53 17.5H13.7l8.4 8.4L20 28 8 16 20 4l2.1 2.1-8.4 8.4H53z"></path></svg>
                    </div>
                    <div className={classes.PostWrapper}>
                        {
                            this.props.loading
                                ? <Loader />
                                : <div>
                                    <h1>{ this.state.formControls.title.value }</h1>
                                    <div>
                                        {
                                            // console.log(this.state.bigImg)
                                            !!this.state.bigImg
                                            ? <div className={classes.wrap_big_img}>
                                                <div
                                                    style={{ backgroundImage: `url(${this.state.bigImg})` }}
                                                    className={classes.img_background_big}
                                                ></div>
                                            </div> : null
                                        }
                                        {
                                            // console.log(this.createArrForImgRender())
                                            this.state.formControls.img.value.length > 1
                                            ? <div className={classes.wrap_little_img}>    
                                                { 
                                                    this.state.formControls.img.value.map((srcImg, i) => {
                                                        return (
                                                            <div 
                                                                key={i}
                                                                onClick={() => this.changeBigImg(srcImg)}
                                                                style={{ backgroundImage: `url(${srcImg})` }}
                                                                className={classes.img_background}
                                                            ></div>
                                                        )
                                                    })
                                                }
                                            </div> : null 
                                        }
                                        {
                                            this.state.formControls.video.value
                                            ? <div className={classes.wrap_big_img}>
                                                <iframe width={ this.state.video.width } height={ this.state.video.height } src={this.state.formControls.video.value} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} frameBorder="100"></iframe>
                                            </div> : null    
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
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        url: state.config.url,
        auth: state.auth,
        config: state.config,
        all: state.services.all,
        token: state.auth.token,
        isAdmin: state.config.isAdmin
    }
}
function mapDispatchToProps(dispatch) {
    return {
        createOne: formData => dispatch(createOne(formData)),
        updateOne: (id, formData, formDataForLocalUpdate) => dispatch(updateOne(id, formData, formDataForLocalUpdate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create)