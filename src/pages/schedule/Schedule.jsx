import { db } from "@/context/Firebase/firebase.config";
import { Button } from "@material-tailwind/react";
import { data } from "autoprefixer";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react"

export function Schedule() {
  const [schedule, setSche] = useState({ id: '', class: localStorage.getItem('class'), content: [{ mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }] });
  const [current, setCur] = useState({ name: '', value: '' })
  const value = collection(db, 'schedule');
  const getData = async () => {
    let res = await getDocs(query(value, where('class', '==', localStorage.getItem('class'))))
    return res;
  }
  const [edit, setEdit] = useState();
  const sub = collection(db, 'subject');
  const [subject, setSub] = useState([])

  useEffect(() => {
    getData().then(res => {
      let datas = res.docs.map(doc => {
        let re = doc.data();
        let id = doc.id
        console.log((re?.content));

        return { id: id, class: localStorage.getItem('class'), content: re?.content }
      })
      console.log(datas);
      
      if (datas.length === 0)
        addDoc(value, {
          class: localStorage.getItem('class'), content: [{ mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }, { mor: '', aft: '' }]
        }
        ).then(ress=>{
          getData().then(resa=>{
            
            let datas = resa.docs.map(doc => {
              let re = doc.data();
              let id = doc.id
              let val = re?.content 
              return { id: id, class: localStorage.getItem('class'), content: val }
            })
            setSche(datas[0])
          })
        }
        )
      else setSche(datas[0])
    })
    getDocs(sub).then(res => {
      let subj = res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id

        return { name: val.name, id: id }

      }); setSub(subj)
    })
  }, [])


  const update = () => {
    let data = schedule.content
    data[edit] = subData;
    console.log(data);
    
    updateDoc(doc(db, 'schedule', schedule.id), {class:schedule.class, content: data}).then(res => {
    alert("Done!");
    setEdit()
    setSubDt({ mor:'', aft:'' })
    })
  }
  const [subData, setSubDt] = useState({ mor:'', aft:'' })


  return (
    <>
      <div className="w-full bg-white p-4">
        {edit !== undefined && <div className="fixed top-0 left-0 z-[70] w-full h-full flex flex-col justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="absolute w-full h-full bg-opacity-75 z-[70]" onClick={() => { setEdit(); }}></div>
          <div className="relative z-[72] bg-white p-4 rounded-lg flex-col flex gap-2">
            <div className="w-full text-center">Lịch thứ {edit + 2}</div>
            <div className="flex items-start justify-between gap-2 ">
              <label htmlFor="">Sáng</label>
              <textarea className="border border-gray-500 w-[200px]" name="sang" value={subData.mor} onChange={(e) => { e.preventDefault(); setSubDt({ ...subData, mor: e.target.value }) }} /></div>
            <div className="flex items-start justify-between gap-2">
              <label htmlFor="">Chiều</label>
              <textarea className="border border-gray-500 w-[200px]" name="chieu" value={subData.aft} onChange={(e) => setSubDt({ ...subData, aft: e.target.value })} />
            </div>
            <div className="flex w-full justify-center items-center"> <Button color="green" onClick={() => { update() }}>
            { 'Lưu'}
          </Button></div>
          </div>
          
        </div>}
        
        <table className="w-full">
          <thead>
            <tr>
              {/* <td className="text-center">STT</td> */}
              <th></th>
              <th onDoubleClick={() => setEdit(0)}>Thứ 2</th>
              <th onDoubleClick={() => setEdit(1)}>Thứ 3</th>
              <th onDoubleClick={() => setEdit(2)}>Thứ 4</th>
              <th onDoubleClick={() => setEdit(3)}>Thứ 5</th>
              <th onDoubleClick={() => setEdit(4)}>Thứ 6</th>
              <th onDoubleClick={() => setEdit(5)}>Thứ 7</th>

            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-500">
              <td className="text-center">Sáng</td>
              {/* <td className="text-center">{[1,2,3,4,5,6].map(v=><><span>{v}</span><br/></>)}</td> */}
              {
                schedule?.content?.map(val => <td className="text-center"><div>{val.mor.split(',').map(v=><><span>{v}</span><br/></>)}</div></td>)
              }

            </tr>
            
            <tr>
              <td className="text-center">Chiều</td>
              {/* <td className="text-center">{[1,2,3,4,5,6].map(v=><><span>{v}</span><br/></>)}</td> */}
              {
                schedule?.content?.map(val =>  <td className="text-center"><div>{val.aft.split(',').map(v=><><span>{v}</span><br/></>)}</div></td>)
              }

            </tr>


          </tbody>
        </table>
      </div>
    </>
  )
}