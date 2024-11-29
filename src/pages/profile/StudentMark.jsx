import {
  Card,
  CardHeader,
  CardBody,
  Typography
} from "@material-tailwind/react";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";


export function StudentMark() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [subject, setSubject] = useState([]);
  const [mark, setMark] = useState([]);
  const [editM, setEditM] = useState({ id: null, mark: null, subject: null, uid: null, type: null });
  const [classes, setClass] = useState([]);
  const [choseClass, setChose] = useState();
  const [type, setType] = useState('15-1');

  const value = collection(db, 'student');
  const sub = collection(db, 'subject');
  const ma = collection(db, 'mark');
  const cl = collection(db, 'class')
  const getData = async () => {
    let res = await getDocs(query(value, where('email', '==', localStorage.getItem('email'))))
    return res;
  }
  function getDataTable() {
    getData().then(res => {
      let std = res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { name: val.name, id: id }
      })
      setData(std);
      getDocs(sub).then(res => {
        let subj = res.docs.map(doc => {
          let val = doc.data();
          let id = doc.id

          return { name: val.name, id: id }
        })
        setSubject(subj)
        getDocs(query(ma, where('uid', '==', std[0].id))).then(res => {

          console.log(res.docs.map(doc => {
            let val = doc.data();
            let id = doc.id
            return { id: id, uid: val.uid, mark: val.mark, subject: val.subject, type: val.type }
          }));
          
          setMark(res.docs.map(doc => {
            let val = doc.data();
            let id = doc.id
            return { id: id, uid: val.uid, mark: val.mark, subject: val.subject, type: val.type }
          }))
        })
      })
    })
  }



  useEffect(() => {

   getDataTable()
  }, []);



  function getMark(type, sub) {
    
    return mark.filter(m => m.type === type && m.subject === sub)[0]
  }

  function getSubject(className) {
    getDocs(sub).then(res => {
      let subj = res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id

        return { name: val.name, id: id }
      })
      setSubject(subj)
    })
  }
  function lastSub() {
    return localStorage.getItem('role') === 'parent' || (choseClass === localStorage.getItem('class') && localStorage.getItem('role') !== 'none') ? subject.map(val => val)
      : subject.filter(val => val.name === localStorage.getItem('subject'));
  }
  const markType = ['15-1', '45-1', 'HK1', '15-2', '45-2', 'HK2']
  const headers = ["STT", "Môn"];
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between">
            <Typography variant="h6" color="white">
              Bảng điểm
            </Typography>

          </div>
        </CardHeader>
        <div className="flex space-x-3 px-4">
          {localStorage.getItem('role') !== 'parent' && classes.map((cl, i) => <span key={i} className="px-2 py-2 border rounded-lg border-black cursor-pointer text-center"
            style={choseClass === cl.name ? { backgroundColor: "#323232", color: 'white' } : {}}
            onClick={() => {
              setChose(cl.name); getDataTable(cl.name);
            }}
          >
            {cl.name}
          </span>)}

        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[...headers].map((el) => (
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
                  markType.map(el => <th
                    key={el.id}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>)
                }
              </tr>

            </thead>
            <tbody>
              {subject.map(
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

                          </div>
                        </div>
                        {

                        }
                      </td>
                      {markType.map(typ => <td className={className}>
                        <div className="flex items-center gap-4 hidden-item cursor-pointer">


                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {getMark(typ, id)?.mark ?? 'N/A'}
                          </Typography>



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
  );
}

export default StudentMark;
