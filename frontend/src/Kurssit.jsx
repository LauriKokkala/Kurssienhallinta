import React, {useState, useEffect} from 'react';
import '../css/App.css';
import Row from "./Row.jsx";

function Kurssit() {


  const [info, setInfo] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [teach, setTeach] = useState("");
  const [room, setRoom] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [display, setDisplay] = useState("none");
  const [editId, setEditId] = useState(null);
  var availability;

  const teacherOptions = Array.from(
    new Map(
      info.map(row => [
        row.Opettaja,
        { id: row.Opettaja, name: `${row.Etunimi} ${row.Sukunimi}` }
      ])
    ).values()
  );

  const roomOptions = Array.from(
    new Map(
      info.map(row => [
        row.Tila,
        { id: row.Tila, name: row.TilanNimi }
      ])
    ).values()
  );


  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/list/kurssit")
      .then((results) => results.json())
      .then((text) => setInfo(text));
  };

  function BasicRow(row) {
    return(row.Kapasiteetti <= row.Osallistujat ? (
              availability = "(Täynnä)"
                ) : (
                  availability = ""
                ), 
                <Row
                  key={row.Tunnus}
                  data1={row.KurssiNimi}
                  data2={row.Kuvaus}
                  data3={new Date(row.Alkupaiva).toLocaleDateString()}
                  data4={new Date(row.Loppupaiva).toLocaleDateString()}
                  data5={row.Etunimi + " " + row.Sukunimi}
                  data6={row.TilanNimi + availability}
                  data9={
                    <div>
                      <button onClick={() => editClicked(row.Tunnus, row)}>?</button>
                      <button onClick={() => deleteClicked(row.Tunnus)}>-</button>
                    </div>
                    
                  }     
                />
            )
  }

  function editClicked(id, rowData) {
    console.log("edit")
    setEditId(id);
  }
  

  function addClicked() {
    console.log("add käyttäjä")
    setEditId(null);
    setName("");
    setDesc("");
    setStart("");
    setEnd("");
    setTeach("");
    setRoom("");
    setDisplay("")
  }

  function sendData() {
    console.log("data sent!")
    const data = { nimi: name, kuvaus: desc, alku: start, loppu: end, opettaja: teach, tila: room}

    const requestOptions = {
      method: editId === null ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      
    };
    console.log(data)
    const url = editId === null
    ? "http://127.0.0.1:5000/add/kurssit"
    : `http://127.0.0.1:5000/update/kurssit/${editId}`;

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
    setDesc("");
    setStart("");
    setEnd("");
    setTeach("");
    setRoom("");
  };

  function deleteClicked(id) {
    console.log("delete!")
    fetch("http://127.0.0.1:5000/delete/kurssit", {
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
        <h1>Kurssit</h1>
            <div className="topbar">
                <a>Kurssit</a>
                <a href='/kurssikirjautumiset'>Kurssikirjautumiset</a>
                <a href='/tilat'>Tilat</a>
                <a href='/opettajat'>Opettajat</a>
                <a href='/opiskelijat'>Opiskelijat</a>
            </div>
        <div className="table">
          <table>
            <Row
              data1="Nimi"
              data2="Kuvaus"
              data3="Alkupäivä"
              data4="Loppupäivä"
              data5="Opettaja"
              data6="Tila"
              data7={<select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
                      <option value="">Valitse Opettaja</option>
                      {teacherOptions.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                        ))}
                        </select>}
              data8={<select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
                      <option value="">Valitse Tila</option>
                      {roomOptions.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                        ))}
                        </select>}
              data9={<button onClick={addClicked}>+</button>}
            />
            {info.map((row) => (

              editId === row.Tunnus ? (
                <Row
                  key={row.Tunnus}
                  data1={<input value={name} onChange={(e) => setName(e.target.value)} type="text"/>}
                  data2={<input value={desc} onChange={(e) => setDesc(e.target.value)} type="text" />}
                  data3={<input value={start} onChange={(e) => setStart(e.target.value)} type="date" />}
                  data4={<input value={end} onChange={(e) => setEnd(e.target.value)} type="date" />}
                  data5={<select value={teach} onChange={(e) => setTeach(e.target.value)}>
                      <option value="">Valitse Opettaja</option>
                      {teacherOptions.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                        ))}
                      </select>}
                  data6={<select value={room} onChange={(e) => setRoom(e.target.value)}>
                      <option value="">Valitse Huone</option>
                      {roomOptions.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                        ))}
                      </select>}
                  data9={<button onClick={sendData}>S</button>}
                />
              ) : teacherFilter == row.Opettaja ? (
                  BasicRow(row)

              ) : roomFilter == row.Tila ? (
                  BasicRow(row)
                    
              ) : teacherFilter === "" && roomFilter === "" ? (
                  BasicRow(row)

              ) : (
                  null
              )
            ))}
            <Row
              show={display}
              data1={<input value={name} onChange={(e) => setName(e.target.value)} type="text"/>}
              data2={<input value={desc} onChange={(e) => setDesc(e.target.value)} type="text" />}
              data3={<input value={start} onChange={(e) => setStart(e.target.value)} type="date" />}
              data4={<input value={end} onChange={(e) => setEnd(e.target.value)} type="date" />}
              data5={<select value={teach} onChange={(e) => setTeach(e.target.value)}>
                      <option value="">Valitse Opettaja</option>
                      {teacherOptions.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                        ))}
                      </select>}
              data6={<select value={room} onChange={(e) => setRoom(e.target.value)}>
                      <option value="">Valitse Huone</option>
                      {roomOptions.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                        ))}
                      </select>}
              data9={<button onClick={sendData}>Lisää</button>}
            />
          </table> 
        </div>
    </div>
  );
}

export default Kurssit;