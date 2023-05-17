const db = require("../models")
const Dpd = db.dpds;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Dpd.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Dpd.find({ nama_dpd : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .sort({ kode_dpd : 1 })
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
            message : err.message || "some error while retreiving dpd data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''

    await Dpd.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'DPD0000' : result[result.length - 1].kode_dpd

        const checkKode = result.length == 0 || null ? 'DPD0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits)	.slice(-4);
                generateKode = strings + digits;

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpd data."
        })
    });
    
    const dpd = await new Dpd({
        kode_dpd : generateKode,
        nama_dpd : req.body.nama_dpd,
    })

    await dpd.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new dpd data.",
        })
    })
}

exports.show = async (req, res) => {
    await Dpd.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpd data."
        })
    });
}

exports.delete = async (req, res) => {

    await Dpd.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Dpd.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving dpd data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpd data."
        })
    });
}

exports.update = async (req, res) => {

    await Dpd.findOne({
        _id : req.body.id
    })
    .then( async (result) => {

        await Dpd.updateOne({_id : result.id}, { 
            $set : {
                nama_dpd : req.body.nama_dpd ? req.body.nama_dpd : result.nama_dpd
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new dpd data.",
            })
        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving dpd data."
        })
    });

    
}