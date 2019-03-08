import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function GridCell(props){

  const {bgColor} = props;
  const style={
    width:'20px',
    height:'20px',
    background: bgColor,
    border:'1px solid black'
  }
  return(
    <div style={style}>

    </div>
  )
}

function GridRow(props){
  const style={
    display:'flex'
  }
  const {row} = props;
  return(
    <div style={style}>
        {
          row.map((color,index)=>{
            return( <GridCell bgColor={color} key={index}/> )
          })
        }
    </div>
  )
}

function Grid(props){
  const {grid} = props;
  return(
    <div>
        {
          grid.map((row,index)=>{
            return( <GridRow row={row} key={index} />)
          })
        }
    </div>
  )
}

class Game extends Component{
  
  constructor(props){
    super(props)
    var grid = []
    for(var i=0;i<30;++i){
      grid.push(new Array(30).fill('green'))
    }

    var bird ={height:10,position:2}

    var towers = [
      {position:4,height:5,upright:false},
      {position:8,height:8,upright:true},
      {position:12,height:6,upright:false},
      {position:16,height:9,upright:true},
      {position:20,height:14,upright:false},
      {position:24,height:3,upright:true}
    ]

    grid[bird.height][bird.position] = 'yellow';
    this.state = {grid,bird,towers};
    this.handleClick = this.handleClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.restart = this.restart.bind(this);

    this.setState({grid,bird,towers,crashed:false,score:0});

    this.timerID = setInterval(()=>{
      var {bird,towers,crashed,score} = this.state;

      if(crashed){ return }

      var grid = []
      for(var i=0;i<30;++i){ grid.push(new Array(30).fill('green')) }
      
      towers.forEach((tower,index)=>{
        var {position,height,upright} = tower;
          position--;
          if(position<0){
            towers[index].position = 29;
            towers[index].height = Math.floor(Math.random()*7+3);
          }
          else{
            towers[index].position = position;
          }
      })

      towers.forEach((tower,index)=>{
        var {position,height,upright} = tower;  
        for(var j=0;j<height;++j){
            grid[upright?29-j:j][position] = 'blue'
          }
      });

      for(let i=0;i<30;++i){
        if(grid[i][2]=='blue' && bird.height==i){
          bird.height=10;
          crashed = true
        }
      }

      bird.height++;
      if(bird.height>29 || bird.height<0){
        bird.height = 10;
        crashed=true
      }

      //if(crashed){ this.setState({crashed}) }

      grid[bird.height][bird.position] = 'yellow';
      this.setState({grid,bird,towers,crashed,score:score+1});

    },200)
  }

  handleClick = (e)=>{
    var {bird,crashed} = this.state;
    if(crashed){ return }
    bird.height -=3;
    this.setState({bird});

  }

  handleKey = (e)=>{
    if(e.keyCode===32){
      var {bird,crashed} = this.state;
      if(crashed){ return }
      bird.height -=3;
      this.setState({bird});
    }
  }

  restart = (e)=>{
    var grid = []
    for(var i=0;i<30;++i){
      grid.push(new Array(30).fill('green'))
    }

    var bird ={height:10,position:2}

    var towers = [
      {position:4,height:5,upright:false},
      {position:8,height:8,upright:true},
      {position:12,height:6,upright:false},
      {position:16,height:9,upright:true},
      {position:20,height:14,upright:false},
      {position:24,height:3,upright:true}
    ]

    grid[bird.height][bird.position] = 'yellow';
    this.setState({grid,bird,towers,crashed:false,score:0});
  }

  componentDidMount(){
    document.addEventListener("keydown",this.handleKey,false)
  }

  componentWillUnmount(){
    document.removeEventListener("keydown",this.handleKey,false)
  }

  render(){
      const {grid,crashed,score} = this.state;
    return(
      <div onClick={this.handleClick} >
        <Grid grid={grid} />
        {crashed ? <button onClick={this.restart}>Restart</button>:null}
        <p>Score : {score? score:0}</p>
      </div>
    )
  }
}

export default Game;
