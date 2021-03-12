
const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');

const Constants = require('../Constants').Constants;
const UserDBHelper = require('../dbCollections/UserDB').UserDBHelper;
const UserDBModel = require('../dbCollections/UserDB').UserDBModel;
const Data = require('../DTOs/Data').Data;

router.use(express.json());


router.post('/signUp', async function(req,res)
{ 
    try
    {
        let data = process.posData.data;

        data.flowSuccess = false;
        data.posState = Constants.PosState.signedOff;

        var user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(user)
        {    
            res.status(400).send("User with given email already exists!");
            return;
        }
        var validation = UserDBHelper.validate(req.body); 
        if(validation.error)
        {
            res.status(400).send(validation.error.details[0].message);
            return;
        }
        let newUser = UserDBHelper(req.body.email, req.body.password ,req.body.name);
        await UserDBHelper.pushMultiple([newUser]);
        
        data.userEmail = newUser.email;
        data.flowSuccess = true;

        process.posData.data = data;
        process.posData.txns = [];

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/signIn', async function(req,res)
{
    try
    {
        let data = process.posData.data;
        
        data.errorMsg = "";
        data.userEmail = "";
        data.flowSuccess = false;
        data.posState = Constants.PosState.signedOff;

        const msg = "Invalid Email or Password!";
        const user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(!user)
        {    
            data.errorMsg = msg;
            res.status(400).send(process.posData);
            return;
        }

        data.userEmail = user.email;

        const loginSuccess = await bcrypt.compare(req.body.password , user.password);
        if(!loginSuccess)
        {    
            data.errorMsg = msg;
            res.status(400).send(process.posData);
            return;
        }

        data.flowSuccess = true;
        data.posState = Constants.PosState.signedOn;

        process.posData.data = data;
        process.posData.txns = [];

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        res.status(500).send(process.posData);
    }
    return;
});

router.post('/signOut', async function(req,res)
{
    try
    {
        process.posData = {
            data : new Data() ,
            txns : [] 
        };

        let data = process.posData.data;
        data.flowSuccess = true;
        data.errorMsg = "";
        process.posData.data = data;
        process.posData.txns = [];
        
        res.send(process.posData);

    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        res.status(500).send(process.posData);
    }
    return;
});

module.exports = router;