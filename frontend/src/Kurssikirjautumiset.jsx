import React, {useState, useEffect} from 'react';
import '../css/App.css';
import Row from "./Row.jsx";
function Kurssikirjautumiset() {


  const [info, setInfo] = useState([]);
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");
  const [regDate, setRegDate] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");  
  const [display, setDisplay] = useState("none");
  const [editId, setEditId] = useState(null);


  const studentOptions = Array.from(
    new Map(
      info.map(row => [
        row.Opiskelija,
        { id: row.Opiskelija, name: `${row.Etunimi} ${row.Sukunimi}` }
      ])
    ).values()
  );

  const courseOptions = Array.from(
    new Map(
      info.map(row => [
        row.Kurssi,
        { id: row.Kurssi, name: row.KurssiNimi }
      ])
    ).values()
  );
  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/list/kurssikirjautumiset")
      .then((results) => results.json())
      .then((text) => setInfo(text));
  };

  function BasicRow(row) {
    return (
                    <Row
                      key={row.Tunnus}
                      data1={`${row.Etunimi} ${row.Sukunimi}: -${row.Vuosikurssi}`}
                      data2={row.KurssiNimi}
                      data3={new Date(row.Kirjautumispaiva_aika).toLocaleString('fi-FI', { timeZone: 'UTC' })}
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
    setStudent("");
    setCourse("");
    setRegDate("");
    setDisplay("")
  }
  
  function sendData() {
    console.log("data sent!")
    const data = { opiskelija: student, kurssi: course, kirjautumispaiva_aika: regDate}
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
    ? "http://127.0.0.1:5000/add/kurssikirjautumiset"
    : `http://127.0.0.1:5000/update/kurssikirjautumiset/${editId}`;

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
    setStudent("");
    setCourse("");
    setRegDate("");
    setCourseFilter("");
    setStudentFilter("")
  };

  function deleteClicked(id) {
    console.log("delete!")
    fetch("http://127.0.0.1:5000/delete/kurssikirjautumiset", {
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
        <h1>Kurssikirjautumiset</h1>
            <div className="topbar">
                <a href='/kurssit'>Kurssit</a>
                <a>Kurssikirjautumiset</a>
                <a href='/tilat'>Tilat</a>
                <a href='/opettajat'>Opettajat</a>
                <a href='/opiskelijat'>Opiskelijat</a>
            </div>
        <div className="table">
          <table>
            <Row
              data1="Opiskelija"
              data2="Kurssi"
              data3="Kirjautumispäivä-aika"
              data4={<select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                      <option value="">Valitse Kurssi</option>
                      {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                        ))}
                        </select>}
              data5={<select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
                      <option value="">Valitse Opiskelija</option>
                      {studentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                        ))}
                        </select>}
              data9={<button onClick={addClicked}>+</button>}
            />

            {info.map(row => 
               editId === row.Tunnus ? (
                <Row
                  key={row.Tunnus}
                  data1={
                      <select value={student} onChange={(e) => setStudent(e.target.value)}>
                      <option value="">Valitse Opiskelija</option>
                      {studentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                        ))}
                      </select>
                      }
                  data2={<select value={course} onChange={(e) => setCourse(e.target.value)}>
                      <option value="">Valitse Kurssi</option>
                      {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                        ))}
                      </select>
                      }
                  data3={<input value={regDate} onChange={(e) => setRegDate(e.target.value)} type="date" />}
                  data9={<button onClick={sendData}>S</button>}
                />
              ) : courseFilter == row.Kurssi ? (
                  BasicRow(row)

              ) : studentFilter == row.Opiskelija ? (
                  BasicRow(row)
                    
              ) : courseFilter === "" && studentFilter === "" ? (
                  BasicRow(row)

              ) : (
                  null
              )
            )}
            <Row
              show={display}
              data1={<select value={student} onChange={(e) => setStudent(e.target.value)}>
                      <option value="">Valitse Opiskelija</option>
                      {studentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                        ))}
                      </select>}
              data2={<select value={course} onChange={(e) => setCourse(e.target.value)}>
                      <option value="">Valitse Kurssi</option>
                      {courseOptions.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                        ))}
                      </select>}
              data3={<input value={regDate} onChange={(e) => setRegDate(e.target.value)} type="date" />}
              data9={<button onClick={sendData}>Lisää</button>}
            />
          </table> 
        </div>
    </div>
  );
}

export default Kurssikirjautumiset;