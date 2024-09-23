import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [persons, setPersons] = useState([]);
  useEffect(function () {
    console.log("Electron window..", window.api.greetings("Hello from React"));

    async function getPersonData() {
      const personData = await window.api.getPersonData();
      const parsedData = await JSON.parse(personData);
      console.log("ParsedPerson", parsedData);
      setPersons(parsedData);
    }
    getPersonData();
  }, []);

  function personHandlerMain(person) {
    console.log("After update:", window.api.addPersonData(person));
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-title">React - Electron App.</p>
        <AddPerson personHandlerMain={personHandlerMain} />
        <PersonContainer persons={persons} />
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

// function PersonContainer({ persons }) {
//   return (
//     <div className="person-container">
//       {persons.length > 0 &&
//         persons?.map(({ name, author, publishedOn}, index) => {
//           return (
//             <div className="person" key={index}>
//               <p className="person-name">{name}</p>
//               <p className="person-author">Author: {author}</p>
//               <p className="person-publishedon">Published On : {publishedOn}</p>
//             </div>
//           );
//         })}
//     </div>
//   );
// }
function AddPerson({ personHandlerMain }) {
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
      {/* <input
        type="date"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="publishedon"
      /> */}

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="publishedon"
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input type="button" value="Submit Person" onClick={personHandler} />
    </div>
  );
}
export default App;
