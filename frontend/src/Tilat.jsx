import React, {useState, useEffect} from 'react';
import '../css/App.css';
import Row from "./Row.jsx";

function Opettajat() {


  const [info, setInfo] = useState([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [display, setDisplay] = useState("none");
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/list/tilat")
      .then((results) => results.json())
      .then((text) => setInfo(text));
  };

  function editClicked(id, rowData) {
    console.log("edit")
    setEditId(id);
  }
  

  function addClicked() {
    console.log("add käyttäjä")
    setEditId(null);
    setName("");
    setCapacity(0);
    setDisplay("")
  }

  function sendData() {
    console.log("data sent!")
    const data = { nimi: name, kapasiteetti: capacity}
    console.log(data)

    const requestOptions = {
      method: editId === null ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      
    };
    console.log(data)
    const url = editId === null
    ? "http://127.0.0.1:5000/add/tilat"
    : `http://127.0.0.1:5000/update/tilat/${editId}`;

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
    setCapacity(0);
  };

  function deleteClicked(id) {
    console.log("delete!")
    fetch("http://127.0.0.1:5000/delete/tilat", {
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
        <h1>Tilat</h1>
            <div className="topbar">
                <a href='/kurssit'>Kurssit</a>
                <a href='/kurssikirjautumiset'>Kurssikirjautumiset</a>
                <a>Tilat</a>
                <a href='/opettajat'>Opettajat</a>
                <a href='/opiskelijat'>Opiskelijat</a>
            </div>
        <div className="table">
          <table>
            <Row
              data1="Nimi"
              data2="Kapasiteetti"
              data9={<button onClick={addClicked}>+</button>}
            />
            {info.map((row) => (

              editId === row.Tunnus ? (
                <Row
                  key={row.Tunnus}
                  data1={<input value={name} onChange={(e) => setName(e.target.value)} type="text" />}
                  data2={<input value={capacity} onChange={(e) => setCapacity(e.target.value)} type="number" />}
                  data9={<button onClick={sendData}>S</button>}
                />
              ) : (
                <Row
                  key={row.Tunnus}
                  data1={row.TilanNimi}
                  data2={row.Kapasiteetti}
                  data9={
                    <div>
                      <button onClick={() => editClicked(row.Tunnus, row)}>?</button>
                      <button onClick={() => deleteClicked(row.Tunnus)}>-</button>
                    </div>
                  }     
                />
                
              )
            ))}
            <Row
              show={display}
              data1={<input value={name} onChange={(e) => setName(e.target.value)} type="text"/>}
              data2={<input value={capacity} onChange={(e) => setCapacity(e.target.value)} type="number" />}
              data9={<button onClick={sendData}>Lisää</button>}
            />
          </table> 
        </div>
    </div>
  );
}

export default Opettajat;