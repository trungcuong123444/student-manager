import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";
import emailjs from '@emailjs/browser';
import { AuthContext } from "@/context/AuthProvider/AuthProvider";
import * as XLSX from 'xlsx';

function Student() {
  const { createUser } = useContext(AuthContext);
  const [attend, setAtt] = useState([])
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [newAtt, setNewAtt] = useState({ name: '', id: '', email: '', birth: '', fee: false, class: localStorage.getItem('class') })
  const [detail, setDetail] = useState();

  function handleDelete(id) {
    const deleteVal = doc(db, "user", id)
    deleteDoc(deleteVal).then(res => {
      alert("Xoá thành công!");
    })
  }

  const cl = collection(db, 'class')
  const value = collection(db, 'student');
  const sub = collection(db, 'attendance')

  const getData = async () => {
    let res = await getDocs(query(value, where('class', '==', localStorage.getItem('class'))))
    return res;
  }
  function getDataTable() {
    getData().then(res => {
      console.log(1);

      setData(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { id: id, name: val.name, email: val?.email, birth: val?.birth, fee: val?.fee }
      }))
    })
    getDocs(sub).then(res => {
      setAtt(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { day: val.day, month: val.month, id: id, year: val.year, sid: val.sid }
      }))
    })

  }
  useEffect(() => {
    getData().then(res => {
      setData(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { id: id, name: val.name, email: val?.email, birth: val?.birth, fee: val?.fee }
      }))
    })
    getDocs(sub).then(res => {
      setAtt(res.docs.map(doc => {
        let val = doc.data();
        let id = doc.id
        return { day: val.day, month: val.month, id: id, year: val.year, sid: val.sid }
      }))
    })
  }, []);

  function getAttend(sid, month) {
    return attend?.filter(att => att.month === month && sid === att.sid).length
  }

  function addTeacher(e) {
    e.preventDefault()
    if (newAtt.id === '') {
      createUser(newAtt.email, '123456').then(res => {
        addDoc(value, newAtt).then(r => {
          setNewAtt({ name: '', id: '', email: '', birth: '', fee: false, class: localStorage.getItem('class') })
          alert("Thêm thành công")
          setShow(false)
          getDataTable()
        })
      })

    }
    else {
      updateDoc(doc(db, 'student', newAtt.id), newAtt).then(res => {
        alert("Done!");
        getDataTable()
        setShow(false)
      })
    }
  }

  const sendEmail = (e) => {
    e.preventDefault();
    for (let i = 0; i < data.length; i++) {
      let temp = {
        to_email: data[i].email,
        class: localStorage.getItem('class'),
        month: new Date().getMonth() + 1,
        text: "Thông báo đóng học phí tháng"
      };
      emailjs
        .send('service_nglxhjg', 'template_7mt5klo', temp, {
          publicKey: 'eQr32sWdOzfOvlprF',
        })
        .then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
    }
    if (i === data.length - 1) {
      alert("Done!")
    }
  };

  const sendEmailMeet = (e) => {
    e.preventDefault();
    for (let i = 0; i < data.length; i++) {
      let temp = {
        send_to: data[i].email,
        class: localStorage.getItem('class'),
      };
      emailjs
        .send('service_nglxhjg', 'template_o9tbjx9', temp, {
          publicKey: 'eQr32sWdOzfOvlprF',
        })
        .then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          },
        );
      if (i === data.length - 1) {
        alert("Done!")
      }
    }

  };

  const sendEmailMeetPri = (e, email) => {
    e.preventDefault();

    let temp = {
      send_to: email,
      class: localStorage.getItem('class')
    };
    emailjs
      .send('service_nglxhjg', 'template_o9tbjx9', temp, {
        publicKey: 'eQr32sWdOzfOvlprF',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("DONE!")
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );


  };
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
      addUserList(dataParse)
    };
    reader.readAsBinaryString(f)
  }

  const [count, setCount] = useState(0);

  const addUserList = (arr) => {
    console.log(arr);
    let className = localStorage.getItem('class')
    for (let i = 0; i < arr.length; i++) {
      setTimeout(() => {
        let val = arr[i];
        console.log(val);
        let data = { name: val.name, email: val?.email, birth: val?.birth, fee: false, class: className }
        createUser(data.email, '123456').then(res => {
          console.log(res);
          addDoc(value, data).then(aa => {
            setCount(count + 1)
            console.log(val);

            if (i === arr.length - 1) {
              alert("DONE!")
            }
          })
        })
      }, 4000)
    }

  }
  useEffect(() => { getDataTable() }, [count])
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {show && <div className="fixed top-0 left-0 z-[70] w-full h-full flex flex-col justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
        <div className="absolute w-full h-full bg-opacity-75 z-[70]" onClick={() => { setShow(false); setNewAtt({ id: '', name: '', sid: "", day: 0, month: 0, year: 0, resson: "" }) }}></div>
        <div className="w-[700px] relative z-[71] max-w-sm p-4 bg-transparent mx-auto bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
          <form onSubmit={(e) => e.defaultPrevented()} className="space-y-6" action="#">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              {(newAtt.id !== '') ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </h5>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tên học sinh
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Tên"
                required
                onChange={(e) => setNewAtt({ ...newAtt, name: e.target.value })}
                value={newAtt.name}
              >
              </input>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Ngày sinh
              </label>
              <input
                type="date"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  let a = new Date(e.target.value);
                  console.log(a);
                  setNewAtt({ ...newAtt, birth: a.toISOString().slice(0, 10) });
                }}
                value={newAtt?.birth}
              >

              </input>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="text"
                name="rs"
                id="rs"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  setNewAtt({ ...newAtt, email: e.target.value });
                }}
                value={newAtt.email}
              />

            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Đóng học phí
              </label>
              <input
                type="checkbox"
                name="rs"
                id="rs"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                onChange={(e) => {
                  setNewAtt({ ...newAtt, fee: e.target.checked });
                }}
                checked={newAtt.fee}
              />

            </div>
            <button
              onClick={addTeacher}
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Lưu
            </button>

          </form>
        </div>
      </div>}

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between">
            <Typography variant="h6" color="white">
              Danh sách học sinh
            </Typography>
            <div className="space-x-2">

              <div className="space-x-2">
                <Button color="green" onClick={() => setShow(true)}>
                  + Thêm học sinh
                </Button>
                <Button color="green" onClick={sendEmail}>
                  Báo đóng học phí
                </Button>
                <Button color="green" onClick={sendEmailMeet}>
                  Báo họp phụ huynh
                </Button>
                <Button color="green">
                  <label htmlFor="file"> Nhập từ file</label>
                  <input type="file" name="file" id="file" onChange={handleUpload} hidden />
                </Button>
              </div>


            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["STT", "Tên", "Email", "Ngày sinh", "Đóng học phí tháng"].map((el) => (
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
                ({ id, name, email, birth, fee }, key) => {
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
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {email}
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
                              {birth}
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
                              {fee ? "Đã đóng" : "Chưa đóng"}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <span
                          onClick={(e) => { e.preventDefault(); setShow(true); setNewAtt({ name: name, id: data[key].id, email: email, birth: birth, fee: fee, class: localStorage.getItem('class') }) }}
                          className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                        >
                          Chi tiết
                        </span> <br />
                        <span className="text-xs font-semibold text-blue-gray-600 cursor-pointer" onClick={(e) => sendEmailMeetPri(e, email)}>Báo họp phụ huynh</span>
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

export default Student;