import { db } from "@/context/Firebase/firebase.config";
import { collection, getDoc, getDocs, limit, query, where } from "firebase/firestore";


const value = collection(db, 'user');
const student = collection(db, 'student');
const roleTeacher = ['homeroom', 'admin', 'none']
const getData = async () =>{
  let res = await getDocs(value)
  return res;
}
export default function getRoleTeacher (email) {
  if (email == 'admin@gmail.com')
    return roleTeacher[1]
  let a =  query(value, where('email', '==', email), limit(1));
  
  
  return  null
}