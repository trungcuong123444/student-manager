import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { db } from "@/context/Firebase/firebase.config";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useState } from "react";

function Absent({ sid }) {
  const [data, setData] = useState([]);
 
  const sub = collection(db, 'attendance')
  const getData = async () => {
    let res = await getDocs(q)
    return res;
  }
 
  useEffect(() => {
    getData().then(res => {
      setData(res.docs.map(doc => {
        let val = doc.data();
        console.log(val);
        
        let id = doc.id
        return {day: val.day, month: val.month, id: id, year: val.year, sid: val.sid, date:val.date.seconds, resson: val.resson }
      }));
    })
    
  }, []);


  const q= query(sub, where('sid', '==', sid))

  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
  return (
    <div className="flex flex-col">

      <Card>
      
        <CardBody className="w-[800px] min-h-[200px] max-h-[350px] overflow-auto px-0 pt-0">
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
              {data.map(
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
                              {new Date(date*1000).toLocaleDateString()}
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
  );
}

export default Absent;