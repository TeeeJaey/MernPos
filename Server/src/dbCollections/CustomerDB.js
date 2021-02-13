

const mongoose = require('mongoose');   // Connect to Mongo Database

const customerModelSchema = new mongoose.Schema({
    custID: { type: String, required : true, unique: true },
    custName: String,
    phoneNumber:  { type: Number, required : true, unique: true },
    points: Number,
    lastUpdateDate: { type: Date, default: Date.now }
});



const CustomerDBModel = mongoose.model('Customer' , customerModelSchema);


class CustomerDBHelper
{
    constructor(custName,phoneNumber)
    {
        this.custID= phoneNumber.toString();
        this.custName= custName;
        this.phoneNumber= phoneNumber;
        this.points = 0;
    }

    // INSERT 
    async insertToDB()
    {
        const dBObj = new CustomerDBModel(this);
        const mongoResult = await dBObj.save();
        return;
    }

    static pushMultiple(elements)
    {
        for(var i = 0 ; i < elements.length ; i++)
        {
            elements[i].insertToDB();
        }   
    }
    
    // READ 
    static async getCustomers(body)            
    {
        let dbCustomers = await CustomerDBModel.find();
        return dbCustomers.filter(x =>  x.custName.toString().toLowerCase().includes(body.custName.toString().toLowerCase()) 
                                    &&  x.phoneNumber.toString().toLowerCase().includes(body.phoneNumber.toString().toLowerCase()));
        
        
    }
     
    static async getCustomerByPhoneNumber(number)            
    {
        let dbCustomers = await CustomerDBModel.find();
        return dbCustomers.find(x => x.phoneNumber.toString().toLowerCase() === number.toString().toLowerCase());
    }
}

module.exports.CustomerDBHelper = CustomerDBHelper;
module.exports.CustomerDBModel = CustomerDBModel;
