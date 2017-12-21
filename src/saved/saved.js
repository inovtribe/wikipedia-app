import React from 'react'
import { connect } from 'react-redux'

import TopNavBar from '@cpt/top-navbar/'
import BottomNavBar from '@cpt/bottom-navbar/'
import WikiListItem from '@cpt/wiki-list-item'

import WikiList from '@cpt/wiki-list/'
import ActionSheet from '@cpt/action-sheet/'
import LongPress from '@cpt/longpress/'

import get from '@/js/fetch'
import { LONTPRESSTIMEOUT } from '@/constants'

let scroll = 0

class Saved extends React.Component {

    componentWillMount() {
    }
    componentDidMount() {
        window.scroll(0, scroll)
    }

    componentWillUnmount() {
        console.log('saved: componentWillUnmount')
        scroll = window.scrollY
    }

    render() {

        console.log('saved rendered')
        const { savedItems, actTargetID,
            showActions, cancelActions, deleteItems, clearAll } = this.props
        return (
            <main >
                <TopNavBar
                    // iconLeft={TopNavBar.i.back}
                    leftContent={'Clear'}
                    onLeftClick={clearAll}
                    iconRight={TopNavBar.i.search}
                    onRightClick={window.loadTestDataToIndexDB}
                    // eslint-disable-next-line
                    onTitleClick={() => location.reload()}
                >Saved</TopNavBar>

                <LongPress handler={(t) => {
                    let li = t.closest('li.wiki-list-item')
                    console.log(li)
                    li && showActions(li)
                }}>
                    <WikiList items={savedItems}></WikiList>
                </LongPress>


                {actTargetID && <ActionSheet cancelHandler={cancelActions}
                    actions={[
                        { title: '查看', handler: () => { console.log('view fired') } },
                        { title: '删除', fontColor: 'red', handler: () => { deleteItems(actTargetID) }, }
                    ]}></ActionSheet>}


                <BottomNavBar></BottomNavBar>
            </main >
        )
    }
}


function fetchSummary(items) {
    return function (dispatch) {
        return
    }
}


function mapState({ saved }) {
    return {
        savedItems: saved.savedItems || [],
        actTargetID: saved.actTargetID,
    }
}
function mapDispatch(dispatch) {
    return {
        showActions: (li) => {
            const liid = li.dataset.liid
            dispatch({ type: 'SAVED/SHOWACTIONS', payload: { actTargetID: liid } })
        },
        cancelActions: () => {
            dispatch({ type: 'SAVED/HIDEACTIONS' })
        },
        deleteItems: (title) => {
            dispatch({ type: 'SAVED/DELETEITEM', payload: { delTitles: [title] } })
        },
        clearAll: () => {
            dispatch({ type: 'SAVED/CLEAR' })
        }
    }
}


export default connect(mapState, mapDispatch)(Saved)