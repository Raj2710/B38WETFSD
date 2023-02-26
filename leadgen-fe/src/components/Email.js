import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
import {url} from '../App'

function Email() {
    let [subject,setSubject] = useState("")
    let [message,setMessage] = useState("")
    let token = sessionStorage.getItem('token')
    let navigate = useNavigate()

    let sendEmail = async()=>{
        try {
            let res = await axios.post(`${url}/send-email`,{subject,message},{
                headers:{
                    authorization:`Bearer ${token}`
                }
            })
            if(res.status===200)
            {
                toast.success(res.data.message)
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
  return <div>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Subject</Form.Label>
        <Form.Control type="text" placeholder="Enter Subject" onChange={(e)=>setSubject(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Body</Form.Label>
        <Form.Control as="textarea" rows={10} onChange={(e)=>setMessage(e.target.value)}/>
      </Form.Group>

      <Button variant="primary" onClick={sendEmail}>
        Send Email
      </Button>
    </Form>
  </div>
}

export default Email