const Config =   require('../models/config')


exports.getShop = (req, res, next) => {
    
    Config.findOne({type: 'TIMING'}).then(shop=>{
        return res.status(200).json({
            success: true,
            shop: shop,
        })
    }).catch(err=>{
        throw err
    })
}


exports.updateShop = (req, res, next) => {
    const {type, status, statusTitle, statusSubTitle} = req.body;

    Config.findOne({type: type}).then(shop=>{
        shop.status =  status;
        shop.statusTitle = statusTitle;
        shop.statusSubTitle= statusSubTitle
        return shop.save()
        
    }).then(shop=>{
        return res.status(200).json({
            success: true,
            msg: 'Shop updated Successfully!',
            shop: shop,
        })
    })
    .catch(err=>{
        throw err
    })
}
