import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Absent from "./detail/Absent";
import emailjs from '@emailjs/browser';

function Attendance() {
    const [attend, setAtt] = useState([])
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [newAtt, setNewAtt] = useState({ id: '', name: '', sid: "", day: 0, month: 0, year: 0, resson: "", date: null })
    const [detail, setDetail] = useState();
    const [classes, setClass] = useState([]);
    const [learn, setLearn] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [choseClass, setChose] = useState(localStorage.getItem('class'));
    function handleDelete(id) {
        const deleteVal = doc(db, "user", id)
        deleteDoc(deleteVal).then(res => {
            alert("Xoá thành công!");
        })
    }

    const cl = collection(db, 'class')
    const value = collection(db, 'student');
    const sub = collection(db, 'attendance')
    const getData = async (classe) => {
        let res = await getDocs(query(value, where('class', '==', classe)))
        return res;
    }
    const getClass = async () => {
        let res = await getDocs(cl)
        return res;
    }
    function getDataTable(classes) {
        getData(classes).then(res => {

            setData(res.docs.map(doc => {
                let val = doc.data();
                let id = doc.id
                return { id: id, name: val.name }
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
        getData(localStorage.getItem('class')).then(res => {
            setData(res.docs.map(doc => {
                let val = doc.data();
                let id = doc.id
                return { name: val.name, id: id, email: val.email }
            }))
        })
        getDocs(sub).then(res => {
            setAtt(res.docs.map(doc => {
                let val = doc.data();
                let id = doc.id
                return { day: val.day, month: val.month, id: id, year: val.year, sid: val.sid }
            }))
        })
        getClass().then(res => {
            let classe = res.docs.map(doc => {
                let val = doc.data();
                let id = doc.id

                return { name: val.name, id: id }
            })
            setClass(classe);
        })
    }, []);

    const sendEmail = (e, email) => {
        e.preventDefault();
        var data = {
            to_email: email,
            class: localStorage.getItem('class'),
            month: new Date().toLocaleString(),
            text: "Thông báo học sinh nghỉ học vào"
        };
        emailjs
            .send('service_nglxhjg', 'template_7mt5klo', data, {
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
    };

    function getAttend(sid, month) {
        return attend?.filter(att => att.month === month && sid === att.sid).length
    }

    function addTeacher(e) {
        e.preventDefault()
        if (newAtt.id === '') {
            addDoc(sub, newAtt).then(r => {
                setNewAtt({ id: '', name: '', sid: "", day: 0, month: 0, year: 0, resson: "", date: '' })
                alert("Thêm thành công")
                setShow(false)
                getDataTable()
            })
        }
        else {
            updateDoc(doc(db, 'attendance', newAtt.id), newAtt).then(res => {
                alert("Done!");
                getDataTable()
                setShow(false)
            })
        }
    }
    const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            {show && <div className="fixed top-0 left-0 z-[70] w-full h-full flex flex-col justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                <div className="absolute w-full h-full bg-opacity-75 z-[70]" onClick={() => { setShow(false); setNewAtt({ id: '', name: '', sid: "", day: 0, month: 0, year: 0, resson: "" }) }}></div>
                <div className="w-[700px] relative z-[71] max-w-sm p-4 bg-transparent mx-auto bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                    <form onSubmit={(e) => e.defaultPrevented()} className="space-y-6" action="#">
                        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                            {(attend.id !== '') ? 'Chỉnh sửa thông tin lớp học' : 'Đăng ký lớp học mới'}
                        </h5>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Tên học sinh
                            </label>
                            <select
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Tên"
                                required
                                onChange={(e) => setNewAtt({ ...newAtt, sid: e.target.value })}
                                value={attend.name}
                            >
                                <option value=""></option>
                                {data.map(stu => <option key={stu.id} value={stu.id}>{stu.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Thơi gian
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
                                    setNewAtt({ ...newAtt, day: a.getDay(), month: a.getMonth() + 1, year: a.getFullYear(), date: a });
                                }}
                                value={newAtt?.date ? new Date(newAtt?.date).toISOString().split('T')[0] : null}
                            >

                            </input>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Lý do nghỉ
                            </label>
                            <textarea
                                name="rs"
                                id="rs"
                                className="bg-gray-50 border min-h-[150px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required
                                onChange={(e) => {
                                    setNewAtt({ ...newAtt, resson: e.target.value });
                                }}
                                value={newAtt.resson}
                            />

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
            {
                detail && <div className="fixed top-0 left-0 z-[70] w-full h-full flex flex-col justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
                    <div className="relative z-[71]">
                        <Absent sid={detail} />
                    </div>
                    <div className="absolute w-full h-full bg-opacity-75 z-[69]" onClick={() => setDetail()}></div>
                </div>
            }
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                    <div className="flex justify-between">
                        <Typography variant="h6" color="white">
                            Bảng chấm công
                        </Typography>
                        {localStorage.getItem('role') === 'homeroom' && <div className="space-x-2">

                            <Button color="green" onClick={() => setShow(true)}>
                                + Đăng ký phép
                            </Button>

                        </div>}
                    </div>
                </CardHeader>

                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <div className="flex space-x-3 px-4">
                        {localStorage.getItem('role') === 'homeroom' && [...JSON.parse(localStorage.getItem('classes')), localStorage.getItem('class')].map((cl, i) => <span key={i} className="px-2 py-2 border rounded-lg border-black cursor-pointer text-center"
                            style={choseClass === cl ? { backgroundColor: "#323232", color: 'white' } : {}}
                            onClick={() => { setChose(cl); getDataTable(cl) }}
                        >
                            {cl}
                        </span>)}
                        {localStorage.getItem('role') === 'none' && [...JSON.parse(localStorage.getItem('classes')), localStorage.getItem('class')].map((cl, i) => <span key={i} className="px-2 py-2 border rounded-lg border-black cursor-pointer text-center"
                            style={choseClass === cl ? { backgroundColor: "#323232", color: 'white' } : {}}
                            onClick={() => { setChose(cl); getDataTable(cl) }}
                        >
                            {cl}
                        </span>)}
                    </div>
                    <div className="flex space-x-3 px-4">
                        <span>Sĩ số: {data.length}</span>
                        <span>Học: {learn}</span>
                        <span>Vắng: {absent}</span>
                    </div>
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["STT", "Tên"].map((el) => (
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
                                <th>Có mặt</th>
                                <th>Vắng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(
                                ({ id, name, email }, key) => {
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
                                                <div className="text-center">

                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                    >
                                                        <input type="radio" name={'learn'+key} id="" onChange={(e) => { setLearn(learn + 1); setAbsent(absent > 0 ? absent - 1 : 0) }} />
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-center">

                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                    >
                                                        <input type="radio" name={'learn'+key} id="" onChange={(e) => { setAbsent(absent + 1); setLearn(learn > 0 ? learn - 1 : 0) }} />
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <div className="text-center">

                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                    >
                                                        <span
                                                            onClick={(e) => { e.preventDefault(); setDetail(id) }}
                                                            className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                                                        >
                                                            Xem chi tiết
                                                        </span> <br/>
                                                        <span className="text-xs font-semibold text-blue-gray-600 cursor-pointer" 
                                                        onClick={(e) => sendEmail(e, email)}>Báo phụ huynh</span>
                                                    </Typography>
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
    );
}

export default Attendance;