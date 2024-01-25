// import logo from './logo.svg';
import React,{ useState } from "react";
import './App.css';
import List from './components/List';
import Navbar from './components/Navbar';
import Newgoal from './components/Newgoal';

function App() {
  const [goallist,setgoallist]=useState([
    { id: 'gl1', itemlist: 'krishna is good boy' },
    { id: 'gl2', itemlist: 'hi' },
    { id: 'gl3', itemlist: 'how do you do' },
  ])
  // const goallist = [
  //   { id: 'gl1', itemlist: 'krishna is good boy' },
  //   { id: 'gl2', itemlist: 'hi' },
  //   { id: 'gl3', itemlist: 'how do you do' },
  // ]
  // setInterval(() => {
  //  console.log('krishna');
  //  console.log('hi');
  // }, 500);
  
  const addnewgoalhandler = (newGoal) => {
    // goallist.push(newGoal);
    // console.log(goallist);
    // document.write(goallist);
    setgoallist((bullet)=>{
      return bullet.concat(newGoal)
    }
    );
  }
  
  return (
    <div>
      <Navbar />
      <Newgoal onAddGoal={addnewgoalhandler} />
      <List goals={goallist} />
    </div>
  );
}

export default App;
