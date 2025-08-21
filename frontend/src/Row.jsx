import '../css/App.css';

function Row({show, data1, data2, data3, data4, data5, data6, data7, data8, data9}) {

  if (show === undefined) {
    show = ""
  }
  //Pyydän anteeksi jumalalta, että nimesin ne näin
  return (
    <tr className='row' style={{ display: show }}>
        <td className='item'>{data1}</td>
        <td className='item'>{data2}</td>
        <td className='item'>{data3}</td>
        <td className='item'>{data4}</td>
        <td className='item'>{data5}</td>
        <td className='item'>{data6}</td>
        <td className='item'>{data7}</td>
        <td className='item'>{data8}</td>
        <td className='item'>{data9}</td>
        
    </tr>
  );
}

export default Row;