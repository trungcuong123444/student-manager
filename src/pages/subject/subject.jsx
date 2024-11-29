import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "@/context/AuthProvider/AuthProvider";
import * as XLSX from 'xlsx';

export function Subjects() {
  const {createUser} = useContext(AuthContext);
  const [subject,setSubject] = useState({id:'', name: '', head:''})
  const [data,setData] = useState([]);
  const [show,setShow] = useState(false);
  const [user,setUser] =useState([]);

function handleDelete(id){
  const deleteVal = doc(db, "subject", id)
  deleteDoc(deleteVal).then(res=>{
    alert("Xoá thành công!");
  })
}
  const gv =collection(db, 'user'); 
  const value = collection(db, 'subject');
  const getData = async () =>{
    let res = await getDocs(value)
    return res;
  }
  
  useEffect(()=>{
    getDocs(value).then(res=>{
      setData(res.docs.map(doc=>{
        let val =doc.data();
        let id = doc.id
        return {name:val.name,head: val.head, id: id}
    }))
    })
    getDocs(gv).then(res=>{
      setUser(res.docs.map(doc=>{
        let val =doc.data();
        let id = doc.id
        return {name:val.name, id: id}
    }))
    })
  },[]);

  function getName(id){
    return user.filter(u => u.id === id)[0]?.name;
  }
  function addTeacher(e){
    e.preventDefault()
    if (subject.id===''){
    for (let i = 0;i<data.length; i++){
      if (data[i].name === subject.name){
        alert("Môn h đã tồn tại!")
      }
    }
  
      addDoc(value, {name: subject.name, head: subject.head}).then(r =>{
        console.log(r);
        setSubject({id:'', name: '', head: ''})
        alert("Thêm thành công")
        setShow(false)
        getDataTable()
      })
    }
    else {
      updateDoc(doc(db, 'subject',subject.id), subject).then(res=>{
        console.log(res);
        getDataTable()
        alert("Done!");
        setShow(false)
      })
    }

  }
  function getDataTable(){
    getDocs(value).then(res=>{
      setData(res.docs.map(doc=>{
        let val =doc.data();
        let id = doc.id
        return {name:val.name,head: val.head, id: id}
    }))
    })
  }
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
     {show && <div className="fixed top-0 left-0 z-[70] w-full h-full flex flex-col justify-center items-center" style={{backgroundColor:"rgba(0,0,0,0.7)"}}>
        <div className="absolute w-full h-full bg-opacity-75 z-[70]" onClick={()=>setShow(false)}></div>
        <div className="w-[700px] relative z-[71] max-w-sm p-4 bg-transparent mx-auto bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
          <form onSubmit={(e)=>e.defaultPrevented()} className="space-y-6" action="#">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              {(subject.id!=='')? 'Chỉnh sửa thông tin môn học':'Thêm môn học mới'}
            </h5>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tên
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Tên"
                required
                onChange={(e)=>setSubject({...subject, name: e.target.value})}
                value={subject.name}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Chủ nhiệm
              </label>
              <select
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
                onChange={(e)=>{setSubject({...subject, head: e.target.value});;
                }}
                value={subject.head}
              >
                <option value=""></option>
                {user.filter(u=> !data.filter(s=>subject.id!==s.id).map(s=>s.head).includes(u.id)).map(u => <option value={u.id} key={u.id}>{u.name}</option>)}
              </select>
            </div>
            
            <button
            onClick={addTeacher}
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
            
          </form>
      </div>
      </div>}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between">
          <Typography variant="h6" color="white">
            Danh sách môn học
          </Typography>
          <div className="space-x-2">
          <Button color="green" onClick={()=>setShow(true)}>
            + Thêm môn học
          </Button>
          
          </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["STT", "Tên", "Chủ nhiệm"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({id,name,head}, key) => {
                  const className = `py-3 px-5 ${
                    key === data.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {key+1}
                            </Typography>
                            
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                      
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          {getName(head)}
                        </Typography>
                      </td>
                      
                      <td className={className}>
                        <Typography
                          as="button"
                          onClick={()=>{setShow(true);setSubject({...subject,id:id,name: name, head: head})}}
                          className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                        >
                          Edit
                        </Typography>
                        <Typography
                          as="button"
                          className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                          onClick={()=>handleDelete(id)}
                        >
                          Delete
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Subjects;
