import { useState, useEffect } from "react"
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
  IconButton,
} from "@material-tailwind/react";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";


const ParentPage = () => {
  const [subject, setSubject] = useState([]);
  const [mark, setMark] = useState([]);
  const [editM, setEditM] = useState({ id: null, mark: null, subject: null, uid: null });
  const [classes, setClass] = useState([]);
  const [choseClass, setChose] = useState();
  const [type, setType] = useState('15-1');
  const [data, setData] = useState([]);
  const [absent, setAbsent] = useState(0);

  const value = collection(db, 'student');
  const sub = collection(db, 'subject');
  const ma = collection(db, 'mark');
  const cl = collection(db, 'class')
  const att = collection(db, 'attendance')

  const getData = async (className) => {

    let res = localStorage.getItem('role') === 'parent' ? await getDocs(query(value, where('email', '==', localStorage.getItem('email')))) :
      await getDocs(query(value, where('class', '==', className)))
    return res;
  }
  function getDataTable(className) {
    getData(className).then(res => {
      setData(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, id: id, email: val.email, birth: val.birth, fee: val?.fee }
      }));
      getDocs(sub).then(res => {
        let subj = res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id

          return { name: val.name, id: id }
        })
        setSubject(localStorage.getItem('role') === 'parent' || localStorage.getItem('role') === 'homeroom' ? subj
          : subj.filter(val => val.name === localStorage.getItem('subject')))
      })
      getDocs(query(ma, where('type', '==', type))).then(res => {
        setMark(res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id
          return { id: id, uid: val.uid, mark: val.mark, subject: val.subject }
        }))
      })
    })
  }
  useEffect(() => {
    getDocs(query(ma, where('type', '==', type))).then(res => {

      setMark(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { id: id, uid: val.uid, mark: val.mark, subject: val.subject }
      }))
    })
  }, [type])
  useEffect(() => {

    getDocs(cl).then(res => {
      let classe = res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id

        return { name: val.name, id: id }
      })
      setClass(classe);
      setChose(classe[0].name)
      getData(classe[0].name).then(res => {
        setData(res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id

          return { name: val.name, id: id, email: val.email, birth: val.birth, fee: val?.fee }
        }))
        getDocs(sub).then(res => {
          setSubject(res.docs.map(doc => {
            let val = doc.data();
            let id = doc.id

            return { name: val.name, id: id }
          }))
        })
        getDocs(query(ma, where('type', '==', type))).then(res => {
          setMark(res.docs.map(doc => {
            let val = doc.data();
            let id = doc.id
            return { id: id, uid: val.uid, mark: val.mark, subject: val.subject }
          }))
        })
      })
    })
  }, []);

  useEffect(() => {
    if (data.length > 0)
      getAbsent(data[0]?.id, new Date().getMonth() + 1)
  }, [data])

  function getAbsent(sid, month) {
    getDocs(query(att, where("sid", "==", sid), where("month", '==', month))).then(res => {
      console.log(res.docs.map(doc => {
        let val = doc.data();
        return val
      }).length);

      setAbsent(res.docs.map(doc => {
        let val = doc.data();
        return val
      }).length)
    })
  }
  const [schedule, setSche] = useState({ id: '', class: localStorage.getItem('class'), mon: [], tue: [], wen: [], thu: [], fri: [], sat: [], sun: [] });
  const sche = collection(db, 'schedule');
  const getSche = async () => {
    let res = await getDocs(query(sche, where('class', '==', localStorage.getItem('class'))))
    return res;
  }
  useEffect(() => {
    getSche().then(res => {
      let datas = res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { id: id, class: localStorage.getItem('class'), mon: val.mon, tue: val.tue, wen: val.wen, thu: val.thu, fri: val.fri, sat: val.sat, sun: val.sun }
      })
      console.log(datas);

      setSche(datas[0])
    })

  }, [])
  function getMark(sub, uid) {
    return mark.filter(m => m.uid === uid && m.subject === sub)[0]
  }
  return (<>
    <div className="flex flex-row-reverse w-full h-[56px] px-6 py-3">
      <NavLink>
        <Button
          onClick={() => { location.href = '/auth/sign-in' }}
          variant={"gradient"}
          color={
            "blue-gray"
          }
          className="flex items-center gap-4 px-4 capitalize"
          fullWidth
        >
          <Typography
            color="inherit"
            className="font-medium capitalize"
          >
            {localStorage.getItem('login') === 'true' ? "Đăng xuất" : "Đăng nhập"}
          </Typography>
        </Button>

      </NavLink>
    </div>
    <div className="flex flex-col justify-center items-center w-full p-6">
      <div className="flex flex-row w-full gap-5">
        <div className="border border-gray-500 rounded-lg p-4">
          <table>
            <tr>
              <td>Tên:</td>
              <td className="text-right">{data[0]?.name}</td>
            </tr>
            <tr>
              <td>Ngày sinh:</td>
              <td className="text-right">{data[0]?.birth}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td className="text-right">{data[0]?.email}</td>
            </tr>
          </table>
        </div>
        <div className="border border-gray-500 rounded-lg p-4">
          <table>
            <tr>
              <td>Học phí tháng {new Date().getMonth() + 1}:</td>
              <td className="text-right">{data[0]?.fee ? "Đã đóng" : "Chưa đóng"}</td>
            </tr>
            <tr>
              <td>
                Tổng số buổi nghỉ tháng {new Date().getMonth() + 1}:
              </td>
              <td className="text-right">
                {absent}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div className="w-full">
        <div className="mt-12 mb-8 flex flex-col gap-12 w-full">

          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <div className="flex justify-between">
                <Typography variant="h6" color="white">
                  Kết quả học tập
                </Typography>

              </div>
            </CardHeader>
            <div className="flex space-x-3 px-4">
              {localStorage.getItem('role') !== 'parent' && classes.map((cl, i) => <span key={i} className="px-2 py-2 border rounded-lg border-black cursor-pointer text-center"
                style={choseClass === cl.name ? { backgroundColor: "#323232", color: 'white' } : {}}
                onClick={() => { setChose(cl.name); getDataTable(cl.name) }}
              >
                {cl.name}
              </span>)}

            </div>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <div className="p-4 flex gap-3" >
                <label htmlFor="">Loại điểm: </label> {' '}
                <select onChange={(e) => setType(e.target.value)} value={type} className="rounded-sm border-black border ">
                  <option value="15-1">15 phút lần 1</option>
                  <option value="15-2">15 phút lần 2</option>
                  <option value="45-1">45 phút HK1</option>
                  <option value="45-2">45 phút HK2</option>
                  <option value="HK1">Cuối học kỳ 1</option>
                  <option value="HK2">Cuối học kỳ 2</option>
                </select>
              </div>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Tên"].map((el) => (
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
                    {
                      subject.map(el => <th
                        key={el.id}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el.name}
                        </Typography>
                      </th>)
                    }
                  </tr>
                </thead>
                <tbody>
                  {data.map(
                    ({ id, name }, key) => {
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
                                  {name}
                                </Typography>

                              </div>
                            </div>
                          </td>
                          {subject.filter(val => localStorage.getItem('role') !== 'parent' ? val.name === localStorage.getItem('subject') : val !== null).map(sub => <td className={className}>
                            <div className="flex items-center gap-4 hidden-item cursor-pointer">
                              {editM.uid === id && editM.subject === sub.id && localStorage.getItem('role') !== 'parent' ? <input className="w-[25px] text-center" autoFocus
                                onChange={(e) => { setEditM({ ...editM, mark: Number(e.target.value) <= 10 ? Number(e.target.value) : 10 }) }}
                                value={editM.mark}
                                onKeyDown={(e) => {
                                  let charCode = (e.which) ? e.which : e.keyCode;
                                  if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                                    e.preventDefault()
                                  }
                                }}
                              /> : <div onDoubleClick={() => { let a = getMark(sub.id, id); setEditM({ id: a?.id, uid: id, subject: sub.id, mark: a?.mark }) }}>

                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {getMark(sub.id, id)?.mark ?? 'N/A'}
                                </Typography>

                              </div>}
                              
                            </div>
                          </td>)}

                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="w-full">
        <div className="mt-12 mb-8 flex flex-col gap-12 w-full">

          <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <div className="flex justify-between">
                <Typography variant="h6" color="white">
                  Lịch học tháng {new Date().getMonth() + 1}
                </Typography>

              </div>
            </CardHeader>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* <td>{[1,2,3,4,5,6].map(v=><><span>{v}</span><br/></>)}</td> */}
                    <td className="text-center">{schedule.mon?.map(v => <><span>{v}</span><br /></>)}</td>
                    <td className="text-center">{schedule.tue?.map(v => <><span>{v}</span><br /></>)}</td>
                    <td className="text-center">{schedule.thu?.map(v => <><span>{v}</span><br /></>)}</td>
                    <td className="text-center">{schedule.wen?.map(v => <><span>{v}</span><br /></>)}</td>
                    <td className="text-center">{schedule.fri?.map(v => <><span>{v}</span><br /></>)}</td>
                    <td className="text-center">{schedule.sat?.map(v => <><span>{v}</span><br /></>)}</td>

                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  </>)
}
export default ParentPage;