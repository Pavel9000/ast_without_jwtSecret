import React, {Component} from 'react'
import Button from '../UI/button'
// import classes from './index.module.css'
import './index.css';
import {connect} from 'react-redux'


let resize_control = false
// let start = "START"
let xxx = 0 
let yyy = 0
let quality = 0.7
let proportion = 0.75
let needWidth = 250


function preventDefault_func(event) { event.preventDefault() }
function mousemoveWrapper(event) {
    if (event.which == 1 && resize_control) { 
        resize_or_drag(resize_control, event) 
    } 
}
function mouseupWrapper(event) {
    if (event.which == 1) { 
        resize_control = false 
    }
}
function onmousedownTTT(event) {
    // return console.log('fkj')
    if (event.which == 1) { 
        resize_control = 'ttt' 
        yyy = event.pageY
    }
}
function onmousedownBBB(event) {
    if (event.which == 1) { 
        resize_control = 'bbb' 
        yyy = event.pageY
    }
}
function onmousedownLLL(event) {
    if (event.which == 1) { 
        resize_control = 'lll' 
        xxx = event.pageX
    }
}
function onmousedownRRR(event) {
    if (event.which == 1) { 
        resize_control = 'rrr' 
        xxx = event.pageX
    }
}
function onmousedownXD(event) {
    if (event.which == 1) { 
        resize_control = 'xd' 
        xxx = event.pageX
        yyy = event.pageY
    }
}


let change_img = async (idOfInput) => {
    const file = document.getElementById(idOfInput).files[0]
    const base64 = await getBase64(file)
    let image = new Image()
    image.onload = async () => {
        await draw_canvas(image)
        await create_region()
        // start = "STARTED"
    }
    image.src = base64
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    });
}

function draw_canvas(image) {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = (image.height*canvas.width)/image.width
    context.drawImage(
        image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height
    )
}

function create_region() {
    // if ( start !== "START") { return }
    let xd = document.querySelector('#xd')
    let canvas_rect = getCoords(document.querySelector('#canvas'))
    if ( canvas_rect.width >= (proportion)*canvas_rect.height ) {
        xd.style.height = `${canvas_rect.height}px`
        xd.style.width=`${((proportion)*canvas_rect.height)}px`
        xd.style.left = canvas_rect.left + ((canvas_rect.width - ((proportion)*canvas_rect.height))/2) + 'px'
        xd.style.top = canvas_rect.top + 'px'
    } else {
        xd.style.width = `${canvas_rect.width}px`
        xd.style.height=`${((1/proportion)*canvas_rect.width)}px`
        xd.style.left = canvas_rect.left + 'px'
        xd.style.top = canvas_rect.top + (canvas_rect.height - (((1/proportion)*canvas_rect.width)))/2 + 'px'
    }
    update_little()
}

function update_little() {
    let xd = document.querySelector('#xd')
    let xd_rect = getCoords(xd)
    var rrr = document.querySelector('#rrr')
    var rrr_rect = getCoords(rrr)
    rrr.style.left = (xd_rect.left+xd_rect.width-rrr_rect.width/2)+'px'
    rrr.style.top = (xd_rect.top+xd_rect.height/2-rrr_rect.height/2)+'px'
    var lll = document.querySelector('#lll')
    var lll_rect = getCoords(lll)
    lll.style.left = (xd_rect.left-lll_rect.width/2)+'px'
    lll.style.top = (xd_rect.top+xd_rect.height/2-lll_rect.height/2)+'px'
    var ttt = document.querySelector('#ttt')
    var ttt_rect = getCoords(ttt)
    ttt.style.top = (xd_rect.top-ttt_rect.height/2)+'px'
    ttt.style.left = (xd_rect.left+xd_rect.width/2-ttt_rect.width/2)+'px'
    var bbb = document.querySelector('#bbb')
    var bbb_rect = getCoords(bbb)
    bbb.style.top = (xd_rect.top+xd_rect.height-bbb_rect.height/2)+'px'
    bbb.style.left = (xd_rect.left+xd_rect.width/2-bbb_rect.width/2)+'px'
    update_over_lay()
}

function update_over_lay() {
    let xd = document.querySelector('#xd')
    let xd_rect = getCoords(xd)
    let canvas_rect = getCoords(document.querySelector('#canvas'))
    var l_ol = document.querySelector('#l_over_lay')
    l_ol.style.left = (canvas_rect.left)+'px'
    l_ol.style.width = (xd_rect.left - canvas_rect.left)+'px'
    l_ol.style.top = (canvas_rect.top)+'px'
    l_ol.style.height = ( canvas_rect.height )+'px'
    var r_ol = document.querySelector('#r_over_lay')
    r_ol.style.left = (xd_rect.left+xd_rect.width)+'px'
    r_ol.style.width = (canvas_rect.left + canvas_rect.width - ( xd_rect.left+xd_rect.width ) )+'px'
    r_ol.style.top = (canvas_rect.top)+'px'
    r_ol.style.height = ( canvas_rect.height )+'px'
    var t_ol = document.querySelector('#t_over_lay')
    t_ol.style.left = ( canvas_rect.left + (xd_rect.left - canvas_rect.left) )+'px'
    t_ol.style.width = ( xd_rect.width )+'px'
    t_ol.style.top = (canvas_rect.top)+'px'
    t_ol.style.height = ( (xd_rect.top) - (canvas_rect.top) )+'px'
    var b_ol = document.querySelector('#b_over_lay')
    b_ol.style.left = ( canvas_rect.left + (xd_rect.left - canvas_rect.left) )+'px'
    b_ol.style.width = ( xd_rect.width )+'px'
    b_ol.style.top = ( xd_rect.top + xd_rect.height )+'px'
    b_ol.style.height = ( ( canvas_rect.top + canvas_rect.height ) - (xd_rect.top + xd_rect.height) )+'px'
    // document.querySelector('#wrapper').style.display = ''
}

// получаем координаты элемента в контексте документа
function getCoords(elem) {
    let box = elem.getBoundingClientRect()
    return {
        top: box.top + window.pageYOffset,
        left: box.left + window.pageXOffset,
        height: box.bottom - box.top,
        width: box.right - box.left
    }
}

function resize_or_drag(resize_control, event) {
    let xd = document.querySelector('#xd')
    let xd_rect = getCoords(xd)
    let canvas_rect = getCoords(document.querySelector('#canvas'))
    if ( resize_control === 'ttt' ) {
        if ( !( canvas_rect.top > ( (event.pageY - yyy) + (xd_rect.top) ) 
            || ( canvas_rect.top + canvas_rect.height ) < ( (event.pageY - yyy) + (xd_rect.top) + (xd_rect.height) - (event.pageY - yyy) )
            || ( canvas_rect.left ) > ( (xd_rect.left) + (proportion)*(event.pageY - yyy)/2 )
            || ( canvas_rect.left + canvas_rect.width ) < ( (xd_rect.left) + (proportion)*(event.pageY - yyy)/2 + ( (proportion)*((xd_rect.height) - (event.pageY - yyy)) ) )
            || ( (proportion)*((xd_rect.height) - (event.pageY - yyy)) ) < 30
        ) ) {
            xd.style.height = `${((xd_rect.height) - (event.pageY - yyy))}px`
            xd.style.width=`${(proportion)*((xd_rect.height) - (event.pageY - yyy))}px`
            xd.style.left=`${((xd_rect.left) + (proportion)*(event.pageY - yyy)/2)}px`
            xd.style.top = `${((event.pageY - yyy) + (xd_rect.top))}px`
        }
        yyy = event.pageY
        update_little()
    }
    if ( resize_control === 'bbb' ) {
        if ( !( ( canvas_rect.top + canvas_rect.height ) < ( xd_rect.top + (xd_rect.height) + (event.pageY - yyy) )
            || ( canvas_rect.left ) > ( (xd_rect.left) - (proportion)*(event.pageY - yyy)/2 )
            || ( canvas_rect.left + canvas_rect.width ) < ( (xd_rect.left) - (proportion)*(event.pageY - yyy)/2 + (proportion)*((xd_rect.height) + (event.pageY - yyy)) )
            || ( (proportion)*((xd_rect.height) + (event.pageY - yyy)) ) < 30
        ) ) {
            xd.style.height = `${((xd_rect.height) + (event.pageY - yyy))}px`
            xd.style.width=`${(proportion)*((xd_rect.height) + (event.pageY - yyy))}px`
            xd.style.left=`${((xd_rect.left) - (proportion)*(event.pageY - yyy)/2)}px`
        }
        yyy = event.pageY
        update_little()
    }
    if ( resize_control === 'rrr' ) {
        if ( !( canvas_rect.top > ((1/proportion)*(xxx - event.pageX)/2 + (xd_rect.top)) 
            || (canvas_rect.top + canvas_rect.height) < ( ((1/proportion)*(xxx - event.pageX)/2 + (xd_rect.top)) + ((1/proportion)*((event.pageX - xxx) + (xd_rect.width))) )
            || (canvas_rect.left + canvas_rect.width) < ( xd_rect.left+(event.pageX - xxx) + (xd_rect.width) )
            || ( (event.pageX - xxx) + (xd_rect.width) ) < 30
        ) ) {
            xd.style.width=`${(event.pageX - xxx) + (xd_rect.width)}px`
            xd.style.height = `${((1/proportion)*((event.pageX - xxx) + (xd_rect.width)))}px`
            xd.style.top = `${((1/proportion)*(xxx - event.pageX)/2 + (xd_rect.top))}px`
        }
        xxx = event.pageX	
        update_little()
    }
    if ( resize_control === 'lll' ) {
        if ( !( canvas_rect.top > ((1/proportion)*(event.pageX - xxx)/2 + (xd_rect.top)) 
            || (canvas_rect.top + canvas_rect.height)<( ((1/proportion)*(event.pageX - xxx)/2 + (xd_rect.top)) + ((1/proportion)*((xd_rect.width) - (event.pageX - xxx))) )
            || canvas_rect.left>( (xd_rect.left) + (event.pageX - xxx) )
            || ( canvas_rect.left + canvas_rect.width )<( (xd_rect.left) + (event.pageX - xxx) + (xd_rect.width) - (event.pageX - xxx) )
            || ( (xd_rect.width) - (event.pageX - xxx) ) < 30
        ) ) {
            xd.style.width=`${(xd_rect.width) - (event.pageX - xxx)}px`
            xd.style.left=`${(xd_rect.left) + (event.pageX - xxx)}px`
            xd.style.height = `${((1/proportion)*((xd_rect.width) - (event.pageX - xxx)))}px`
            xd.style.top = `${((1/proportion)*(event.pageX - xxx)/2 + (xd_rect.top))}px`
        }
        xxx = event.pageX	
        update_little()
    }
    if ( resize_control === 'xd' ) {
        // вертикальное перемещение
        if ( !( (xd_rect.top + (event.pageY - yyy))<canvas_rect.top || (xd_rect.top + (event.pageY - yyy))+xd_rect.height>canvas_rect.top+canvas_rect.height ) ) {
            xd.style.top = `${((xd_rect.top) + (event.pageY - yyy))}px`
            yyy = event.pageY
        }
        // горизонтальное перемещение
        if ( !( ((xd_rect.left) + (event.pageX - xxx))<canvas_rect.left || ((xd_rect.left) + (event.pageX - xxx))+xd_rect.width>canvas_rect.left+canvas_rect.width ) ) {
            xd.style.left=`${((xd_rect.left) + (event.pageX - xxx))}px`
            xxx = event.pageX	
        }
        update_little()
    }
}

async function resizeAndCompress() {
    let ImageBase64Help = await document.querySelector('#canvas').toDataURL('image/jpeg', 1)
    let imageHelp = await new Image()
    imageHelp.src = ImageBase64Help
    let canvasHelp = document.createElement('canvas')
    let contextHelp = await canvasHelp.getContext('2d')
    // let needWidth = 250
    canvasHelp.width = needWidth
    canvasHelp.height = needWidth*1/proportion
    let xd_rect = getCoords(document.querySelector('#xd'))
    await contextHelp.drawImage(
        imageHelp,
        xd_rect.left, xd_rect.top, xd_rect.width, xd_rect.height,
        0, 0, canvasHelp.width, canvasHelp.height
    )
    return await canvasHelp.toDataURL('image/jpeg', quality)
    // return await canvasHelp.toDataURL('image/jpeg', 0.7)
}


class One extends Component {

    componentDidMount() {
        document.addEventListener("dragstart", preventDefault_func, false) // отмена дефолтного DragAndDrop
        document.querySelector('#wrapper').addEventListener("mousemove", mousemoveWrapper, false)
        document.querySelector('#wrapper').addEventListener("mouseup", mouseupWrapper, false)
        document.querySelector('#ttt').addEventListener("mousedown", onmousedownTTT, false)
        document.querySelector('#bbb').addEventListener("mousedown", onmousedownBBB, false)
        document.querySelector('#lll').addEventListener("mousedown", onmousedownLLL, false)
        document.querySelector('#rrr').addEventListener("mousedown", onmousedownRRR, false)
        document.querySelector('#xd').addEventListener("mousedown", onmousedownXD, false)
    }
    componentWillUnmount() {
        document.removeEventListener("dragstart", preventDefault_func, false) // отмена дефолтного DragAndDrop
        document.querySelector('#wrapper').removeEventListener("mousemove", mousemoveWrapper, false)
        document.querySelector('#wrapper').removeEventListener("mouseup", mouseupWrapper, false)
        document.querySelector('#ttt').removeEventListener("mousedown", onmousedownTTT, false)
        document.querySelector('#bbb').removeEventListener("mousedown", onmousedownBBB, false)
        document.querySelector('#lll').removeEventListener("mousedown", onmousedownLLL, false)
        document.querySelector('#rrr').removeEventListener("mousedown", onmousedownRRR, false)
        document.querySelector('#xd').removeEventListener("mousedown", onmousedownXD, false)
    }

    async resizeFinish() {
        let imgSrcRes = await resizeAndCompress()
        this.props.resizeResponse(imgSrcRes)
    }
    
    render() { 
        if (this.props.needWidth) { needWidth = this.props.needWidth }
        if (this.props.proportion) { proportion = this.props.proportion }
        if (this.props.quality) { quality = this.props.quality }
        if (this.props.showCanvas) { change_img(this.props.idOfInput) }
        return (
            <React.Fragment>
                <div id="wrapper">
                    <div className="tblr_over_lay" id="t_over_lay"></div>
                    <div className="tblr_over_lay" id="b_over_lay"></div>
                    <div className="tblr_over_lay" id="l_over_lay"></div>
                    <div className="tblr_over_lay" id="r_over_lay"></div>
                    <div className="littleDrag" id="ttt"></div>
                    <div className="littleDrag" id="bbb"></div>
                    <div className="littleDrag" id="lll"></div>
                    <div className="littleDrag" id="rrr"></div>
                    <div id="xd"></div>
                    <canvas id='canvas'></canvas>
                </div>
                <div id="wrap_buttom_resize_img">
                    <Button
                        type='success'
                        onClick={() => this.resizeFinish()}
                        // disabled={!this.state.isFormValid}
                    >
                        Обрезать
                    </Button>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        // oneObj: state.posts.one.oneObj,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getOneById: id => dispatch(getOneById(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(One)