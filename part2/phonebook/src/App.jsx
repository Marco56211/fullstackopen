import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [persons, setPersons] = useState([])

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])
  console.log('render', persons.length, 'persons')


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


  const addData = (event) => {
    event.preventDefault();
    const personsObject = {
      name: newName,
      id: String(persons.length + 1),
      number: newNumber,
    };

    const nameExists = persons.some((person) => person.name === newName);

    if (!nameExists) {
      setPersons(persons.concat(personsObject));
      setNewName("");
      setNewNumber("");
    } else {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <NewPersonForm 
      name={newName}
      number ={newNumber}
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      addData={addData}/>

      <h2>Numbers</h2>

      <ul>
        <Person filteredPersons={filteredPersons} />


      </ul>
    </div>
  );
};

const Person = ({filteredPersons}) => {
  return  filteredPersons.map((person) => (
      <li key={person.id}>
        {person.name} {person.number}
      </li>
    ));
  }



  const NewPersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addData}) => {
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


  const Filter = ({searchTerm, handleSearchChange}) => {

    return (
      <div>
        filter: <input type="text" value={searchTerm} onChange={handleSearchChange} />
      </div>
    )
  }







export default App;