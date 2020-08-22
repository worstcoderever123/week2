import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import axios from "axios"
import personService from "./services/person"
import {v4 as uuidv4} from 'uuid'
import person from "./services/person";
import "./App.css"
import Notification from "./Notification"
// uuidv4();

const InfoDisplay = ({persons, filteredEntry, deleteEntry})=>{
  return(
    <div>
      {persons.map(p=>{
        console.log(p)
        if((p.name.toLowerCase().search(filteredEntry.toLowerCase()))!==-1)
          return(
            <div>
              <li key={p.id}>
                {p.name} 
                {p.number}
                <button onClick={()=>deleteEntry(p)}>
                  delete
                </button>
              </li>
            </div>
          )
      })}
    </div>
  )
}


const ToShow = ({hasError, sucOp, errorMessage})=>{
  let displayMessage;

  if(hasError){
    displayMessage=<div className="error">  
    <Notification message={errorMessage}/>
    </div>
  }else{
    displayMessage=<div className="success">
      <Notification message={sucOp}/>
    </div>
  }

  return(
    <div>{displayMessage}</div>
    // <div className="success">  
    //   <Notification message={sucOp}/>
    // </div>

  )
}
  
  const Filter = ({handleFilter}) =>{
    return(
      <p> 
        filter shown with <input onChange={handleFilter}/> 
      </p>
    )
  }
  
  const PersonForm = ({handleSubmit, handleInput, newName, newNumber, handleNumber, setPersons, persons, filteredEntry}) =>{
    const [sucOp, setSucOp] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [hasError, setHasError] = useState(false)

    const deleteEntry = (person)=>{
      const result = window.confirm(`Delete ${person.name}`)

      if(result){
        console.log("WTF?",person)
        const newList = persons
        .filter(p=>{return p!==person})
        
        personService 
          .remove(person.id)
          .then(
            setPersons(newList)
            )
          .catch(error=>{
            setErrorMessage("Error")
            setHasError(true)
            setTimeout(()=>{
              setHasError(null)
            },3000)
          })

      }
    }

    const handleClick = ()=>{

      const finding = persons.find(p=>{
        return p.name.toLowerCase()===newName.toLowerCase()
      })
      // console.log("DUDE",finding)
      if(finding===undefined || finding.length===0){
        const fieldObject = {
          name: newName,
          number: newNumber, 
          id: uuidv4()
        }
        personService 
          .create(fieldObject)
          .then(newPerson=>{
            setPersons([...persons, newPerson])
            setSucOp("testing")
            setTimeout(()=>{
              setSucOp("")
            },2000)
          })
      }
      else{ // we are looking at duplicate name
        const foundSameName = persons.find(p=>{
          return p.name.toLowerCase()===newName.toLowerCase()
        })

        if(window.confirm(`Update ${foundSameName.name}'s information?`))
        {

          const sameNameObject = {...foundSameName, number: newNumber}

          personService
            .update(foundSameName.id, sameNameObject)
            .then( 
              setPersons(
                persons.map(p=>(p.name.toLowerCase()===newName.toLowerCase()
                  ?sameNameObject 
                  :p
                ))
              )
            ).catch(error=>{
              setErrorMessage("Error")
              setHasError(true)
              setTimeout(()=>{
                setHasError(null)
              },2000)
            })
        }
      }
    }

    return(
      <div>
        <ToShow sucOp={sucOp} hasError={hasError} errorMessage={errorMessage}/>
        <form onSubmit={handleSubmit}>
        <div>
          <div>name: <input value={newName} onChange={handleInput}/> </div>
          <div>number: <input value={newNumber} onChange={handleNumber}/> </div>
          <button type='submit' onClick={handleClick}> add </button>
        </div>
      </form>
      <div>
        <InfoDisplay 
        persons={persons}
        filteredEntry={filteredEntry}
        deleteEntry={deleteEntry}
        />
      </div>
    </div>
    )
  }
  
  
  const App = () =>{
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState("") // for controlling form
    const [newNumber, setNewNumber] = useState("")
    const [filteredEntry, setFilteredEntry] = useState("")
    
    useEffect(()=>{
        // axios
        // .get("http://localhost:3001/persons")
        // .then(response=>{
        //     setPersons(prev=>[
        //         ...prev, 
        //         ...response.data.map(r=>({
        //             name: r.name,
        //             number: r.number,
        //             id: persons.length+1
        //         }))
        //     ])
        // })
        personService.getAll()
        .then(initialPersons=>{
          setPersons(initialPersons)
        })


    },[])


    const handleSubmit = (e)=>{ 
      e.preventDefault();
  
      const personObject = {
        name: newName,
        number: newNumber,
        id: uuidv4()
      }
      // const isFound = persons.some(person => person.name === newName)
      // const zz = persons.find(p=>p.name===personObject.name)
      // zz===undefined?setPersons([...persons, personObject]):alert(`${personObject.name} is already added to the phonebook`)
      // setNewName("")
  
    }
  
    const handleInput = (e)=>{
      setNewName(e.target.value)
    }
  
    const handleNumber = (e)=>{
      setNewNumber(e.target.value)
    }
    
    const handleFilter = (e)=>{
      setFilteredEntry(e.target.value);

      
      
      const filteringOut = persons.filter(p=>{
        return(
          p.name.toLowerCase().search(e.target.value.toLowerCase())!==-1
        )
      })
    }
            
    return(
      <div>
        <h2>Phonebook</h2>
        <Filter handleFilter={handleFilter}/>
  
        <h2>add a new</h2>
        <PersonForm 
          handleSubmit={handleSubmit}
          newName={newName}
          newNumber={newNumber}
          handleInput={handleInput}
          handleNumber={handleNumber}
          setPersons={setPersons}
          persons={persons}
          filteredEntry={filteredEntry}
          />
        <h2>Numbers</h2>

        {/* <Entry 
          persons={persons} 
          filteredEntry={filteredEntry}
          setPersons={setPersons}
        /> */}
      </div>
    )
  }



export default App
