import React, {Component} from 'react'
import classes from './index.module.css'
import Loader from '../../../components/UI/loader'
import Button from '../../../components/UI/button'
import {connect} from 'react-redux'
import {getAll} from '../../../store/actions/services/all'
import {deleteOne} from '../../../store/actions/services/delete'

class All extends Component {

    state = {
        loader: false
    }
    
    componentDidMount() {
        if (this.props.all.length === 0) { this.getListArr_start_Limit() }
    }

    getListArr_start_Limit = async () => {
        this.setState({loader: true})
        if (!this.props.showMore) { return }
        let _start = this.props.all.length
        let _limit = 24
        await this.props.getAll(_start, _limit)
        this.setState({loader: false})
    }

    createPrevStr(descr) {
        let prevStr = ''
        let pars_descr = JSON.parse(descr)
        for (let num_descr in pars_descr) {
            prevStr = prevStr + ' ' + pars_descr[num_descr].textContent
            if (prevStr.length > 100) { break }
        }
        if (prevStr.length > 100) {
            prevStr = prevStr.slice(0, 100)
        }
        return prevStr+'...'
    }
        
    render() {
        return (
            <div className={classes.Post}>
                <div className={classes.btnCreate}>
                    {
                        this.props.isAdmin
                            ? <Button
                                type='success'
                                onClick={() => this.props.history.push("/admin/services/create")}
                                // disabled={!this.state.isFormValid}
                                >
                                Создать
                            </Button> 
                            : null
                    }
                </div>
                <div className={classes.PostWrapper}>
                        <h1>Список услуг</h1>

                                <div className={classes.list}>
                                    {
                                        this.props.all.map((one, i) => {
                                            return (
                                                <div className={classes.cardWrap} key={one.id}>
                                                    {/* {console.log(this.props)} */}
                                                    <div 
                                                        onClick={() => this.props.history.push(`${this.props.isAdmin ? '/admin' : ''}/services/${one.id}`)}
                                                        className={classes.list__card}
                                                    >
                                                        {one.isPreview
                                                            ? <div 
                                                                style={{ 
                                                                    backgroundImage: `url(${this.props.url.isDev ? (this.props.url.dev.url+this.props.url.dev.clientPort) : this.props.url.url }/img/services/${one.id}/preview.jpg)` }}
                                                                className={classes.img_background}
                                                            ></div>
                                                            : null
                                                        }
                                                        <div>
                                                            <h4>{one.title}</h4>
                                                            {/* {console.log(one.descr)} */}
                                                            {JSON.parse(one.descr).length ? <p>{this.createPrevStr(one.descr)}</p> : null}
                                                            {/* <h6>подробнее</h6> */}
                                                        </div>
                                                    </div>   


                                                    {
                                                        this.props.isAdmin
                                                            ?  <div className={classes.buttonWrap}>
                                                                    <Button
                                                                        type='success'
                                                                        onClick={() => this.props.deleteOne(one.id)}
                                                                        // disabled={!this.state.isFormValid}
                                                                    >
                                                                        Удалить
                                                                    </Button>
                                                                    <Button
                                                                        type='success'
                                                                        onClick={() => this.props.history.push(`/admin/services/update/${one.id}`)}
                                                                    >
                                                                        Редактировать
                                                                    </Button>
                                                                </div>
                                                            : null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className={classes.wrapShowMore}>
                                    {
                                        this.state.loader
                                            ? <Loader />
                                            : this.props.showMore
                                                ? <div 
                                                    className={classes.showMore}
                                                    onClick={() => this.getListArr_start_Limit()}
                                                >
                                                    Показать еще
                                                </div>
                                                : null
                                    }
                               </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        url: state.config.url,
        showMore: state.services.showMore,
        all: state.services.all,
        isAdmin: state.config.isAdmin
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteOne: (id) => dispatch(deleteOne(id)),
        getAll: (_start, _limit) => dispatch(getAll(_start, _limit))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(All)