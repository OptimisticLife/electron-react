import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const [persons, setPersons] = useState([]);
  const navigate = useNavigate();
  useEffect(function () {
    async function getPersonData() {
      const personData = await window.api.getPersonData();
      const parsedData = await JSON.parse(personData);
      console.log("ParsedPerson", parsedData);
      setPersons(parsedData);
    }
    getPersonData();
  }, []);

  async function personHandlerMain(person) {
    const updatedPersonData = await window.api.addPersonData(person);
    setPersons(updatedPersonData);
  }

  async function generatePdfHandler() {
    navigate("/table-view");
    let response = await window.api.generatePdf(
      "http://localhost:3000/table-view"
    );
    console.log("*** pdf", response);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-title">React - Electron App.</p>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AddPerson
                  generatePdfHandler={generatePdfHandler}
                  personHandlerMain={personHandlerMain}
                />
                <PersonContainer persons={persons} />
              </>
            }
          />
          <Route
            path="/table-view"
            element={
              <>
                <PersonTableView persons={persons} />
              </>
            }
          />
        </Routes>
      </header>
    </div>
  );
}

function PersonContainer({ persons }) {
  return (
    <div className="person-container">
      {persons.length > 0 &&
        persons?.map(({ name, eyeColor, gender, _id }, index) => {
          return (
            <div className="person" key={_id}>
              <p className="person-name">{name}</p>
              <p className="person-author">EyeColor: {eyeColor}</p>
              <p className="person-publishedon">Gender : {gender}</p>
            </div>
          );
        })}
    </div>
  );
}

function PersonTableView({ persons }) {
  return (
    <table className="person-table-container">
      <tr>
        <th>Name</th>
        <th>Eye Color</th>
        <th>Gender</th>
      </tr>
      {persons.length > 0 &&
        persons?.map(({ name, eyeColor, gender, _id }) => {
          return (
            <tr className="table-person" key={_id}>
              <td className="table-person-name">{name}</td>
              <td className="table-person-author"> {eyeColor}</td>
              <td className="table-person-publishedon">{gender}</td>
            </tr>
          );
        })}
    </table>
  );
}

function AddPerson({ personHandlerMain, generatePdfHandler }) {
  const [name, setName] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [gender, setGender] = useState("Male");

  function personHandler() {
    if (name && eyeColor && gender) {
      console.log(name, eyeColor, gender);
      personHandlerMain({
        _id: Math.random() * 186861862,
        name: name,
        eyeColor: eyeColor,
        gender: gender,
      });
      setTimeout(() => {
        setName("");
        setEyeColor("");
        setGender("");
      }, 1500);
    }
  }

  return (
    <div className="addperson-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="title"
        placeholder="name"
      />
      <input
        type="text"
        value={eyeColor}
        onChange={(e) => setEyeColor(e.target.value)}
        className="author"
        placeholder="Eye Color"
      />

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="publishedon"
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input type="button" value="Submit Person" onClick={personHandler} />
      <input type="button" value="Generate PDF" onClick={generatePdfHandler} />
    </div>
  );
}
export default App;
