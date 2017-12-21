import React from 'react'
import WikiListItem from '../wiki-list-item'


export default class extends React.Component {

    render() {
        const { items, children, ...restProps} = this.props
        return (
            <div className="wiki-list" {...restProps}>
                {children ? <div className="listtitle">{children}</div> : ''}
                <ul>
                    {
                        items.map((item) => {
                            return <WikiListItem liID={item.title} key={item.title} {...item }></WikiListItem>
                        })
                    }
                </ul>
            </div>
        )
    }
}
