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


const SummaryPage = () => {
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

  const [attend, setAtt] = useState([]);

  const atts = collection(db, 'attendance')
  const getAtt = async (sid) => {
    let res = await getDocs(query(att, where('sid', '==',sid)))
    return res;
  }

  useEffect(() => {
    if (data.length > 0) {
      getAtt(data[0].id).then(res => {
        setAtt(res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id
          return { day: val.day, month: val.month, id: id, year: val.year, sid: val.sid, date: val.date.seconds, resson: val.resson }
        }));
      })
    }

  }, [data]);
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
        <div className="border border-gray-500 rounded-lg p-4 bg-blue-gray-100">
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
        <div className="border border-gray-500 rounded-lg p-4 bg-green-200">
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
            <CardHeader variant="gradient" color="green" className="mb-8 p-6">
              <div className="flex justify-between">
                <Typography variant="h6" color="white">
                  Chuyên cần
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
            <CardBody className="w-[800px] min-h-[200px] max-h-[350px] overflow-auto px-0 pt-0 ">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["STT", "Ngày nghỉ", "Lý do nghỉ"].map((el) => (
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
                  {attend.map(
                    ({ date, resson }, key) => {
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
                                  {new Date(date * 1000).toLocaleDateString()}
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
                                  {resson}
                                </Typography>
                              </div>
                            </div>
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
      </div>
    
    </div>
  </>)
}
export default SummaryPage;