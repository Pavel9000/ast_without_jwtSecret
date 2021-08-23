import React, {Component} from 'react'
import classes from './index.module.css'
import {connect} from 'react-redux'

class One extends Component {
    
    render() {
    // document.querySelector('#textBox').addEventListener("input", function() {
    //     console.log("input event fired");
    // }, false)
        return (
            <div className={classes.divTextEditor} >
                <input type="hidden" name="myDoc" />
                <div className={classes.toolBar2}>
                    <img className="intLink" title="Выровнять слева" onClick={ () => document.execCommand('justifyleft', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />
                    <img className="intLink" title="Выровнять центр" onClick={() => document.execCommand('justifycenter', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />
                    <img className="intLink" title="Выровнять справа" onClick={() => document.execCommand('justifyright', false, null) } src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />
                </div>
                <div className={classes.textBox} id="textBox" contentEditable="true">
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // oneObj: state.posts.one.oneObj,
        // loading: state.posts.one.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getOneById: id => dispatch(getOneById(id)),
        // leaveOne: () => dispatch(leaveOne())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(One)