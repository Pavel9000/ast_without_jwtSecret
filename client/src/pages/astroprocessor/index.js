import React, {Component} from 'react'
import classes from './index.module.css'
import {connect} from 'react-redux'

class One extends Component {

    state = {
        h1: [
            'Астропроцессор'
        ]
    }

    render() {
        return (
            <div className={classes.Post}>
                <div className={classes.PostWrapper}>
                    <h1>
                        { this.state.h1[0] }
                    </h1>
                </div>
                <div className={classes.PostWrapper}>
                    <iframe 
                        frameBorder="no" 
                        height="995" 
                        scrolling="no" 
                        src="https://sotis-online.ru/?fis=sotol&amp;&amp;m=list&amp;cl=;dt:20180503184436;cityid:9312;name:%CD%EE%E2%E0%FF%20%EA%E0%F0%F2%E0&amp;optset=scr:0" 
                        // style={{ background: "#fff" }} 
                        width="100%">
                    </iframe>
                </div>
            </div>
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