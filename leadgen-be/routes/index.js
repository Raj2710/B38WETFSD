var express = require('express');
var router = express.Router();
const {dbUrl} = require('../config/dbConfig')
const mongoose = require('mongoose')
const {LeadModel} = require('../schema/leadSchema')
const {hashCompare,hashPassword,createToken,decodeToken,validate,roleAdmin} = require('../config/auth')
const {MailService} = require('./../service/mailservice')
mongoose.set('strictQuery',true)
mongoose.connect(dbUrl)

//create a lead - done
router.post('/lead',validate, async(req, res)=> {
  try {
    let doc = new LeadModel(req.body)
    await doc.save()
    res.status(201).send({
      message:"Lead created successfully"
    })
    }
  catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
});

//get lead by id - done
router.get('/lead/:id',validate, async(req,res)=>{
  try {
    let data = await LeadModel.find({_id:req.params.id})

    res.status(200).send({
      leads:data
    })
    }
  catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

// edit lead by id - done
router.put('/lead/:id',validate, async(req,res)=>{
  try {
    let data = await LeadModel.updateOne({_id:req.params.id},{$set:req.body})
    res.status(200).send({
        message:"Lead Updated Successfully"
    })
    }
  catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

//change status of leads - done
router.put('/lead/:id/:toStatus',validate, async(req,res)=>{
  try {
    let data = await LeadModel.updateOne({_id:req.params.id},{$set:{status:req.params.toStatus}})

    res.status(200).send({
     message:"Status Changed Successfully"
    })
    }
  catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

//display the count of each status - done
router.get('/dashboard',validate,roleAdmin,async(req,res)=>{
  try {
    let data = await LeadModel.aggregate([
      {
        $group:{_id:"$status",count:{$sum:1}}
      }])

    res.status(200).send({
      leads:data
    })
    }
  catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

//get the list of leads under each status
router.get('/dashboard-list-items/:status',validate,roleAdmin,async(req,res)=>{
  try {
    let data = await LeadModel.find({status:req.params.status})

    res.status(200).send({
      leads:data
    })
    }
  catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

//email campaing - to do
router.post('/send-email',validate,roleAdmin,async(req,res)=>{
  try {
    let leads = await LeadModel.find({},{email:1,firstName:1,lastName:1})
    for(e in leads)
    {
      await MailService({
        firstName:leads[e].firstName,
        lastName:leads[e].lastName,
        email:leads[e].email,
        subject:req.body.subject,
        message:req.body.message
      })
      break;
    }
    res.status(200).send({
      message:"Email Campaing Sent Successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})






module.exports = router;
