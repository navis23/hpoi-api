const db = require("../models")
const Dpc = db.dpcs;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Dpc.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Dpc.find({ nama_dpc : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .populate({path: 'dpd', select:['kode_dpd', 'nama_dpd']})
        .sort({ kode_dpc : 1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
            page : currentPage,
            limit : perPage,
            search : search
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpc data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Dpc.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'DPC0000' : result[result.length - 1].kode_dpc

        const checkKode = result.length == 0 || null ? 'DPC0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits)	.slice(-4);
                generateKode = strings + digits;

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpc data."
        })
    });
    
    const dpc = await new Dpc({
        kode_dpc : generateKode,
        nama_dpc : req.body.nama_dpc,
        dpd : req.body.dpd,
    })

    await dpc.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new dpc data.",
        })
    })
}

exports.show = async (req, res) => {
    await Dpc.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpc data."
        })
    });
}

exports.delete = async (req, res) => {

    await Dpc.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Dpc.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving dpc data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpc data."
        })
    });
}

exports.update = async (req, res) => {

    await Dpc.findOne({
        _id : req.body.id
    })
    .then( async (result) => {

        await Dpc.updateOne({_id : result.id}, { 
            $set : {
                nama_dpc : req.body.nama_dpc ? req.body.nama_dpc : result.nama_dpc,
                dpd : req.body.dpd ? req.body.dpd : result.dpd,
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new dpc data.",
            })
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpc data."
        })
    });

    
}