import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", id: 1, number: "015119627566" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  console.log(persons);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  // const [showAll, setShowAll] = useState(true);

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

      <form onSubmit={addData}>
        name: <input value={newName} onChange={handleNameChange} />
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <button type="submit">save</button>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
