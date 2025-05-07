import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'
import Notification from '../components/Notification';
import Error from '../components/Notification';

const App = () => {

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [persons, setPersons] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm)
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };



  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);

  };



  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  
  };


  const addData = event => {debugger
    event.preventDefault();
  
    const personsObject = {
      name: newName,
      id: String(persons.length + Math.random()),
      number: newNumber,
    };

    const nameExists = persons.some((person) => person.name === newName);
    const numberExists = persons.some((person) => person.number === newNumber);
    const existingPerson = persons.find(person => person.name === newName);



    if (nameExists && existingPerson && existingPerson.number !== newNumber) {
      // Update the existing person's number using the helper
      personsService
        .update(existingPerson.id, { ...existingPerson, number: newNumber })
        
        .then(updatedPerson => {
          const updatedPersons = persons.map(p =>
            p.id === updatedPerson.id ? updatedPerson : p
          );
          setPersons(updatedPersons);
          setNewName("");
          setNewNumber("");
          console.log(`Updated ${newName}'s number to ${newNumber}`);
        })
        .catch(error => {
          setErrorMessage(
            `'${newName}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
       
        })
       
      }


     

    else {

      personsService
        .create(personsObject)
        .then(returnedPerson => {
          if (!nameExists) {
            setPersons(persons.concat(returnedPerson));
            setInfoMessage(`${newName} has been aded to the phonebook`)
            setTimeout(() => { setInfoMessage(null)}, 5000)
            setNewName("");
            setNewNumber("");
          } else {
            alert(`${newName} is already added to phonebook`);
            setNewName("");
            setNewNumber("");
          }
        })
    }
  }

  const deleteButtonHandler = (id) => {
    const person = persons.find((n) => n.id === id);

    if (!window.confirm(`Delete ${person.name}?`)) return;

    personsService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((n) => n.id !== id));
      })
      .catch((error) => {
        alert(
          `The person '${person.name}' was already deleted from server`
        );
        setPersons(persons.filter((n) => n.id !== id)); // Sync state anyway
      });
  };


  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={infoMessage} />
      <Error message={errorMessage} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <NewPersonForm
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addData={addData} />

      <h2>Numbers</h2>

      <ul>
        <Person filteredPersons={filteredPersons} deleteButtonHandler={deleteButtonHandler} />


      </ul>
    </div>
  );
};

const Person = ({ filteredPersons, deleteButtonHandler }) => {
  return filteredPersons.map((person) => (
    <li key={person.id}>
      {person.name} {person.number}
      <button onClick={() => deleteButtonHandler(person.id)}>delete</button>
    </li>
  ));
};


const NewPersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addData }) => {
  return (

    <form onSubmit={addData}>
      name: <input value={newName} onChange={handleNameChange} />
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <button type="submit">save</button>
    </form>
  )
}


const Filter = ({ searchTerm, handleSearchChange }) => {

  return (
    <div>
      filter: <input type="text" value={searchTerm} onChange={handleSearchChange} />
    </div>
  )
}







export default App;