import React from 'react'

export default function List(props) {
    return (
        <ul className='list' style={{textAlign:'center'}}>
            {props.goals.map(
                goal => {
                    return <li style={{border:'2px solid gray',padding:'2px 20px',margin:'2px'}} key={goal.id}>{goal.itemlist}</li>
                }
            )}
        </ul>

    )
}
