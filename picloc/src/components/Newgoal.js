import React, { useState } from 'react'

export default function Newgoal(props) {
    const [enteredtext,setText]=useState('');
    const textChangeHandler=(event)=>{
        setText(event.target.value);
    }
    const addGoalHandler = event => {
        event.preventDefault();
        const newGoal = {
            id: Math.random().toString(),
            itemlist: enteredtext
        };
        console.log(newGoal);
        props.onAddGoal(newGoal);
        setText('');
    };
    return (
        <form className="container" style={{textAlign:'center'}} onSubmit={addGoalHandler}>
            <input type="text" value={enteredtext} onChange={textChangeHandler}/>add an event<br/>
            <button type="submit">add goal</button>
        </form>
    );
};
