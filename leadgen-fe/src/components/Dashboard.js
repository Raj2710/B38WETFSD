import React,{useState,useEffect,useCallback} from 'react'
import {url} from '../App'
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Navbar from './Navbar'
import Card from 'react-bootstrap/Card';
import { read, utils, writeFile,writeFileXLSX } from 'xlsx';


function Dashboard() {
    let token = sessionStorage.getItem('token')
    let [leads,setLeads] = useState([])
    let [cards,setCards] = useState([])
    let [selectedStatus,setSelectedStatus] = useState("")
    let navigate = useNavigate()

    let getData = async()=>{
        try {
            let res = await axios.get(`${url}/dashboard`,{
                headers:{
                    authorization:`Bearer ${token}`
                }
            })
            if(res.status===200)
            {
                setCards(res.data.leads)
            }
        } catch (error) {
            toast.error(error.response.data.message)
            if(error.response.status===401)
                handleLogout()
        }
    }

    let loadStatusData = async(status)=>{
        try {
            setSelectedStatus(status)
            let res = await axios.get(`${url}/dashboard-list-items/${status}`,{
                headers:{
                    authorization:`Bearer ${token}`
                }
            })
            if(res.status===200)
            {
                setLeads(res.data.leads)
            }
        } catch (error) {
            toast.error(error.response.data.message)
            if(error.response.status===401)
                handleLogout()
        }
    }

    let handleLogout = async()=>{
        sessionStorage.clear()
        navigate('/login')
    }

    const exportFile = useCallback(() => {
        const ws = utils.json_to_sheet(leads);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(wb, `${selectedStatus} Leads.xlsx`);
      }, [leads]);

    useEffect(()=>{
        if(token)
            getData()
        else
            handleLogout()
    },[])

  return <div className='container-fluid wrapper'>
    <Navbar/>
    <div className='card-wrapper'>
    {
        cards.map((e,i)=>{
            return <Card style={{ width: '15rem', cursor:"pointer" }} onClick={()=>{loadStatusData(e._id)}}>
                        <Card.Body>
                        <Card.Title style={{textAlign:"center",fontSize:"25px"}}>{e._id} &nbsp;&nbsp; {e.count}</Card.Title>
                        </Card.Body>
                    </Card>
        })
    }
    </div>
    <Button onClick={()=>exportFile()} style={{width:"100px"}}>Export</Button>
    <div className='table-wrapper'>
        <Table striped bordered hover>
        <thead>
            <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Course</th>
            <th>Created By</th>
            <th>Created At</th>

            </tr>
        </thead>
        <tbody>
            {
                leads.map((e,i)=>{
                    return <tr key={i} style={{cursor:"pointer"}}>
                        <td>{i+1}</td>
                        <td>{e.firstName}</td>
                        <td>{e.lastName}</td>
                        <td>{e.email}</td>
                        <td>{e.mobile}</td>
                        <td>{e.course}</td>
                        <td>{e.createdBy}</td>
                        <td>{new Date(e.createdAt).toLocaleDateString('en-UK')}</td>
                    </tr>
                })
            }
            
        </tbody>
        </Table>
    </div>
  </div>
}

export default Dashboard