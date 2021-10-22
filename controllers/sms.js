const Sms =   require('../models/sms')

exports.updateSms = (req, res, next) => {
    const {status, msg} = req.body
    console.log(status, msg)
    Sms.findOne({status:status}).then(sms=>{
        console.log(sms)
        sms.msg = msg
        return sms.save()
    }).then(sms=>{
        return res.status(200).json({
            success: true,
            sms: sms,
            msg: 'Updated Successfully!'
        })
    }).catch(err=>{
        throw err
    })
}



exports.getSms = (req, res, next) => {
    
    Sms.find().then(sms=>{
        return res.status(200).json({
            success: true,
            sms: sms,
        })
    }).catch(err=>{
        throw err
    })
}