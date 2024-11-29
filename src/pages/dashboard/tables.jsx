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

export function Tables() {
  const { createUser } = useContext(AuthContext);
  const [user, setUser] = useState({ id: '', email: '', name: '', password: '', subject: '', homeroom: "", classes: [] })
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [classes, setClass] = useState([])
  const [subject, setSubject] = useState([]);
  const [fileUpload, setFileUploaded] = useState();
  const handleUpload = (e) => {
    e.preventDefault();
    var files = e.target.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      let wsname = readedData.SheetNames[0];
      let ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      let dataParse = XLSX.utils.sheet_to_json(ws, { header: 2, blankrows: false, rawNumbers: false });
      setFileUploaded(dataParse);

      console.log(dataParse);
      addUserList(dataParse.map(v => { }))
    };
    reader.readAsBinaryString(f)
    document.getElementById('file').value = null;
  }

  function handleDelete(id) {
    const deleteVal = doc(db, "user", id)
    deleteDoc(deleteVal).then(res => {
      alert("Xoá thành công!");
    })
  }

  const addUserList = (arr) => {
    let c = 0;
    for (let i = 0; i < arr.length; i++) {
      let a = arr[i];
      setUser({ id: '', email: a.email, name: a.name, password: a.password, subject: a.subject, homeroom: a.homeroom })
      createUser(user.email, user.password).then(res => {
        console.log(res);

        addDoc(value, user).then(r => {
          console.log(r);
          setUser({ id: '', email: '', name: '', password: '', subject: '', homeroom: false })
          c++;
          setShow(false)
          getDataTable()
        })
      })
      if (c === arr.length) {
        alert("Thêm thành công!")
      }
    }

  }
  const value = collection(db, 'user');
  const sub = collection(db, 'subject')
  const cl = collection(db, 'class')
  const getData = async () => {
    let res = await getDocs(value)
    return res;
  }
  function getDataTable() {
    getData().then(res => {
      console.log(res.docs.map(doc => doc.id));
      setData(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, email: val.email, subject: val.subject, homeroom: val.homeroom, id: id, classes:val.classes }
      }))
    })
  }
  useEffect(() => {
    getData().then(res => {
      console.log(res.docs.map(doc => doc.id));
      setData(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, email: val.email, subject: val.subject, homeroom: val.homeroom, id: id,classes:val.classes }
      }))
    })
    getDocs(sub).then(res => {
      setSubject(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, head: val.head, id: id }
      }))
    })
    getDocs(cl).then(res => {
      setClass(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, teacher: val.teacher, id: id }
      }))
    })

  }, []);

  function addTeacher(e) {
    e.preventDefault()
    if (user.id === '') {
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === user.email) {
          alert("Email đã tồn tại!")
        }
      }
      createUser(user.email, user.password).then(res => {
        console.log(res);

        addDoc(value, user).then(r => {
          console.log(r);
          
          alert("Thêm thành công")
          setShow(false)
          getDataTable()
        })
      })
    }
    else {
      updateDoc(doc(db, 'user', user.id), user).then(res => {
        alert("Done!");
        getDataTable()
        setShow(false)
      })
    }
    setUser({ id: '', email: '', name: '', password: '', subject: '', homeroom: false, classes:[] })
  }
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {show && <div className="fixed top-0 left-0 z-[70] w-full h-full flex flex-col justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
        <div className="absolute w-full h-full bg-opacity-75 z-[70]" onClick={() => setShow(false)}></div>
        <div className="w-[700px] relative z-[71] max-w-sm p-4 bg-transparent mx-auto bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
          <form onSubmit={(e) => e.defaultPrevented()} className="space-y-6" action="#">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              {(user.id !== '') ? 'Chỉnh sửa thông tin giáo viên' : 'Đăng ký giáo viên mới'}
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
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                value={user.name}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                value={user.email}
              />
            </div>
            {(user.id === '') && <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                value={user.password}
              />
            </div>}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Dạy môn
              </label>
              <select
                name="subject"
                id="subject"
                placeholder="Toán"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => setUser({ ...user, subject: e.target.value })}
                value={user.subject}
              >
                <option value=""></option>
                {subject.map(s => <option value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="">
              <div className="">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Là giáo viên chủ nhiệm
                  </label>
                  <select
                    id="terms"
                    name="terms"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onChange={(e) => setUser({ ...user, homeroom: e.target.value })}
                    value={user?.homeroom}
                    defaultValue={user?.homeroom}
                  >
                    <option value={user?.homeroom}>{user?.homeroom}</option>
                    {classes.filter(c => !data.map(d => d.homeroom).includes(c.name) ).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Dạy lớp
              </label>
              <div className="max-h-[150px] overflow-auto">
                <ul>
                  {classes
                    .map(c => <li key={c.id} className="flex">
                      <input type="checkbox" value={c.name} checked={user?.classes?.includes(c.name)}
                        onChange={(e) => {
                          let cl = user.classes;
                          if (e.target.checked) setUser({ ...user, classes: [...cl, c.name] })
                          else setUser({ ...user, classes: cl.filter(v => v !== c.name) })
                        }} /> {c.name}
                    </li>)}
                </ul></div>
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
              Danh sách giáo viên
            </Typography>
            <div className="space-x-2">

              <Button color="green" onClick={() => setShow(true)}>
                + Thêm giáo viên
              </Button>

            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["STT", "Tên & Email", "Môn học", "Chủ nhiệm"].map((el) => (
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
                ({ id, name, email, subject, homeroom ,classes}, key) => {
                  const className = `py-3 px-5 ${key === data.length - 1
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
                              {key + 1}
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
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
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
                          {subject}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          {homeroom}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="button"
                          onClick={() => { setShow(true); console.log({ ...user, id: id, email: email, name: name, subject: subject, homeroom: homeroom,classes: classes});
                          ;setUser({ ...user, id: id, email: email, name: name, subject: subject, homeroom: homeroom,classes: classes}) }}
                          className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                        >
                          Edit
                        </Typography>
                        <Typography
                          as="button"
                          className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                          onClick={() => handleDelete(id)}
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

export default Tables;
