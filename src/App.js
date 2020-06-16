import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Imagelinkform from './components/Imagelinkform/Imagelinkform';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register';
import './App.css';

const particleoptions={
            particles: {
            number:{
              value:100,
              density:{
                enable:true,
                value_area:1000
              }
            }
            }
          }
const initialstate={
  input:'',
  imageurl:'',
  box:{},
  route:'signin',
  user:{
      id:'',
      name:'',
      email:'',
      entries:0,
      joined:''
      }
}
class App extends React.Component {
  constructor(){
    super();
    this.state=initialstate;
  }

  loadUser=(data)=>{
    this.setState({user:{
          id:data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined:data.joined
    }})
  }
  calculatefacelocation=(Data)=>{
      const clarifaiface=Data.outputs[0].data.regions[0].region_info.bounding_box;
      const image=document.getElementById("inputimage");
      const width=Number(image.width);
      const height=Number(image.height);
           
       return{
          
           toprow:clarifaiface.top_row*height,
           rightcol:width-(clarifaiface.right_col*width),
           bottomrow:height-(clarifaiface.bottom_row*height),
           leftcol:clarifaiface.left_col*width
           
       }         
 }
 displaybox=(boxdata)=>{
   this.setState({box:boxdata});
 }
    onInputChange=(event)=>{
      this.setState({input:event.target.value});
      }
      onbuttonSubmit=()=>{
        this.setState({imageurl:this.state.input})
        fetch('http://localhost:3000/imgurl',{
                  method:'post',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({
                    input:this.state.input
                  })
                })
                .then(response=>response.json())
        .then(response=>{
          if(response){
                fetch('http://localhost:3000/img',{
                  method:'put',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({
                    id:this.state.user.id
                  })
          })
          .then(response=>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log)
        }
          this.displaybox(this.calculatefacelocation(response));
        })
         .catch(err=>console.log(err))  

      }
   onRouteChange=(route)=>{
     if(route==='signin')
     {
       this.setState(initialstate);
     }
     this.setState({route:route});
   }  
  render(){
  return (
    <div className="App">
       <Particles className='particles'
              params={particleoptions}
            />
            {this.state.route==='home'
              ? <div>
                        <Navigation onRouteChange={this.onRouteChange}/>
                        <Logo/>
                        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                        <Imagelinkform 
                        onInputChange={this.onInputChange} 
                        onbuttonSubmit={this.onbuttonSubmit}
                        /> 
                        <FaceRecognition imageurl={this.state.imageurl} box={this.state.box}/> 
                </div>
                
                : (
                      this.state.route==='signin'
                        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                      ) 

               
             }
      </div>
  );
}
}

export default App;
