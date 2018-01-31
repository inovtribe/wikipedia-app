import React from "react"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { withRouter } from 'react-router-dom'

import TopNavBar from "@cpt/top-navbar/index.js"
import BottomNavBar from '@cpt/bottom-navbar/'
import WikiList from '@cpt/wiki-list/'
import { Collapse } from '@cpt/wiki-list-item/'
import LongPress from '@cpt/longpress/'

import mapTime from '@/js/mapTime'
import ActionSheet from '@cpt/action-sheet/'


let scroll = 0

class History extends React.Component {
    componentWillUnmount() {
        scroll = window.scrollY
    }
    componentDidMount() {
        window.scroll(0, scroll)
    }

    /* history 的state比较扁平，然后map成复杂结构，方便处理 */

    render() {
        this.longPressTimeoutID = null
        const { historyGroups, actTargetID, history,
            showActions, cancelActions, deleteItems, clearAll } = this.props
        return (
            <main>
                <TopNavBar
                    // iconLeft={TopNavBar.i.back}
                    leftContent={'Clear'}
                    iconRight={TopNavBar.i.search}
                    
                    // eslint-disable-next-line
                    onTitleClick={() => location.reload()}
                    onLeftClick={clearAll}

                    onRightClick={() => this.props.history.push('/search')}

                >History</TopNavBar>

                <TransitionGroup>
                    {historyGroups.map(group => {
                        return (
                            <Collapse key={group.readableTime}>
                                <LongPress handler={(t) => {
                                    let li = t.closest('li.wiki-list-item')
                                    console.log(li)
                                    li && showActions(li)
                                }}>
                                    <WikiList items={group.data} >
                                        {group.readableTime}
                                    </WikiList>
                                </LongPress>
                            </Collapse>
                        )
                    })}
                </TransitionGroup>

                <TransitionGroup>
                    {actTargetID &&
                        <CSSTransition timeout={300} classNames={'action-sheet-animation'}>
                            <ActionSheet cancelHandler={cancelActions}
                                actions={[
                                    { title: '查看', handler: () => { history.push(`wiki/${actTargetID}`) } },
                                    { title: '删除', fontColor: 'red', handler: () => { deleteItems(actTargetID) }, }
                                ]}></ActionSheet>
                        </CSSTransition>
                    }
                </TransitionGroup>
                <BottomNavBar></BottomNavBar>
            </main>
        )
    }
}

function splitHistory(items) {
    return items.reduceRight((mapedState, item) => {
        let { readableTime, index } = mapTime(item.time)
        mapedState[index] = mapedState[index] || { readableTime, data: [] }
        mapedState[index].data.push(item.summary)
        return mapedState
    }, [])
}

function mapState({ history }) {
    return {
        historyGroups: splitHistory(history.historyItems || []),
        actTargetID: history.actTargetID,
    }
}

function mapDispatch(dispatch) {
    return {
        showActions: (li) => {
            console.log('history -> mapDispatch -> show actions')
            const liid = li.dataset.liid
            dispatch({ type: 'HISTORY/SHOWACTIONS', payload: { actTargetID: liid } })
        },
        cancelActions: () => {
            dispatch({ type: 'HISTORY/HIDEACTIONS' })
        },
        deleteItems: (title) => {
            dispatch({ type: 'HISTORY/DELETEITEM', payload: { delTitles: [title] } })
        },
        clearAll: () => {
            dispatch({ type: 'HISTORY/CLEAR' })
        }
    }
}


export default withRouter(connect(mapState, mapDispatch)(History))

