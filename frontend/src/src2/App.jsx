import React, {useState, useEffect} from 'react';
import './App.css';
import Row from "./Row.js";

function App() {

  const [info, setInfo] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState(0);
  const [money, setMoney] = useState(0);
  const [display, setDisplay] = useState("none");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/list")
      .then((results) => results.json())
      .then((text) => setInfo(text));
  };

  function editClicked(id, rowData) {
    console.log("edit")
    setEditId(id);
    setName(rowData[1]);
    setAge(rowData[2]);
    setGender(rowData[3]);
    setMoney(rowData[4]);
  }
  

  function addClicked() {
    console.log("add käyttäjä")
    setEditId(null);
    setName("");
    setAge(0);
    setGender(0);
    setMoney(0);
    setDisplay("")
  }

  function sendData() {
    console.log("data sent!")
    const data = { nimi: name, ika: age, sukupuoli: gender, varat: money}

    const requestOptions = {
      method: editId === null ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const url = editId === null
    ? "http://127.0.0.1:5000/add"
    : `http://127.0.0.1:5000/update/${editId}`;

    fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          fetchData();
          resetForm();
        } else {
          console.error("Failed to send data to server");
        }
      })
      .catch(error => console.error("Error:", error))
  }

  const resetForm = () => {
    setDisplay("none");
    setEditId(null);
    setName("");
    setAge(0);
    setGender(0);
    setMoney(0);
  };

  function deleteClicked(id) {
    console.log("delete!")
    fetch("http://127.0.0.1:5000/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
    .then(response => {
      if (response.ok) {
        fetchData();
      } else {
        console.error('Failed to delete data');
      }
    })
    .catch(error => console.error('Error:', error));
  }


  return (
    <div className="App">
        <h1>Pankki</h1>
        <div className="table">
          <table>
            <Row
              nimi="Nimi"
              ika="Ikä"
              sukupuoli="Sukupuoli"
              varat="Varat"
              nappi={<button onClick={addClicked}>+</button>}
            />
            {info.map((row) => (
              editId === row[0] ? (
                <Row
                  key={row[0]}
                  nimi={<input value={name} onChange={(e) => setName(e.target.value)} />}
                  ika={<input value={age} onChange={(e) => setAge(e.target.value)} type="number" />}
                  sukupuoli={
                    <select value={gender} onChange={(e) => setGender(e.target.value)} name="gender" id="gender">
                      <option value="0">Mies</option>
                      <option value="1">Nainen</option>
                      <option value="2">Muu</option>
                    </select>
                  }
                  varat={<input value={money} onChange={(e) => setMoney(e.target.value)} type="number" />}
                  nappi={<button onClick={sendData}>S</button>}
                />
              ) : (
                <Row
                  key={row[0]}
                  nimi={row[1]}
                  ika={row[2]}
                  sukupuoli={row[3]}
                  varat={row[4]}
                  nappi={
                    <div>
                      <button onClick={() => editClicked(row[0], row)}>?</button>
                      <button onClick={() => deleteClicked(row[0])}>-</button>
                    </div>
                  }     
                />
              )
            ))}
            <Row
              show={display}
              nimi={<input value={name} onChange={(e) => setName(e.target.value)} />}
              ika={<input value={age} onChange={(e) => setAge(e.target.value)} type="number" />}
              sukupuoli={
                <select value={gender} onChange={(e) => setGender(e.target.value)} name="gender" id="gender">
                  <option value="0">Mies</option>
                  <option value="1">Nainen</option>
                  <option value="2">Muu</option>
                </select>
              }
              varat={<input value={money} onChange={(e) => setMoney(e.target.value)} type="number" />}
              nappi={<button onClick={sendData}>Add</button>}
            />
          </table> 
        </div>
    </div>
  );
}

export default App;
