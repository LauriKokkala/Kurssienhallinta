import '../css/App.css';
function Home(){
return (
    <div>
        <h1>
            Hei
        </h1>
        <div class="sidebar">
            <a href='/kurssit'>Kurssit</a>
            <a href='/kurssikirjautumiset'>Kurssikirjautumiset</a>
            <a href='/tilat'>Tilat</a>
            <a href='/opettajat'>Opettajat</a>
            <a href='/opiskelijat'>Opiskelijat</a>
        </div>
    </div>
)
}

export default Home