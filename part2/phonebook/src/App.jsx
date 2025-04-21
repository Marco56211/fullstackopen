import { useState } from "react";

const App = () => {

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])


  const filteredPersons = persons.filter((person) =>
  person.name.toLowerCase().includes(searchTerm)
);

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value.toLowerCase());
};


  console.log(persons);

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