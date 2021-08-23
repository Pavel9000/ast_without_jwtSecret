import React from 'react'
import classes from './index.module.css'

const Backdrop = props => <div className={classes.Backdrop} style={{zIndex: props.zIndex || "88"}} onClick={props.onClick} />

export default Backdrop