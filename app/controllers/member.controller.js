const db = require("../models")
const Member = db.members;
const fs = require('fs');
const path = require("path")

exports.findAll = async (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = req.query.limit || 10;
    const search = req.query.search || '';

    let totalItems;

    await Member.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Member.find({ nama_provider : {$regex : search, $options : "i"}})
        .skip((parseInt(currentPage - 1) * perPage))
        .limit(parseInt(perPage))
        .populate({
            path: 'dpc', 
            populate : {
                path: 'dpd'
            }
        })
        .sort({ updatedAt : -1 })
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
            message : err.message || "some error while retreiving category data."
        })
    });
}

exports.create = async (req, res) => {
    // console.log('test array terakhir' + JSON.stringify(testingo.value))
    let generateKode = ''
    // let galleries_temp = []

    await Member.find()
    .then( result => {

        const lastKode = result.length == 0 || null ? 'MBR0000' : result[result.length - 1].kode_provider

        const checkKode = result.length == 0 || null ? 'MBR0000' : lastKode


        let strings = checkKode.replace(/[0-9]/g, '');
            let digits = (parseInt(checkKode.replace(/[^0-9]/g, '')) + 1).toString();
            if(digits.length < 4)
                digits = ("000"+digits).slice(-4);
                generateKode = strings + digits;
        
        // for(let i = 0; i < req.files['galleries'].length; i++) {
        //     galleries_temp.push(req.files['galleries'][i].path)
        // }

    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })

        if(req.files['logo'][0]) {
            fs.unlinkSync(path.join(req.files['logo'][0].path));
        }
        if(req.files['hero_img'][0]) {
            fs.unlinkSync(path.join(req.files['hero_img'][0].path));
        }
        if(req.files['gallery_one'][0]) {
            fs.unlinkSync(path.join(req.files['gallery_one'][0].path));
        }
        if(req.files['gallery_two'][0]) {
            fs.unlinkSync(path.join(req.files['gallery_two'][0].path));
        }
        if(req.files['gallery_three'][0]) {
            fs.unlinkSync(path.join(req.files['gallery_three'][0].path));
        }

        // if(req.files['galleries']) {
        //     for(let i = 0; i < req.files['galleries'].length; i++) {
        //         fs.unlinkSync(path.join(req.files['galleries'][i].path));
        //     }
            
        // }
    });
    
    const member = await new Member({
        kode_provider : generateKode,
        nama_provider : req.body.nama_provider,
        dpc : req.body.dpc,
        no_reg : req.body.no_reg,
        nama_anggota : req.body.nama_anggota,
        profile_one : req.body.profile_one,
        profile_two : req.body.profile_two,
        services : req.body.services,
        alamat : req.body.alamat,
        telepon : req.body.telepon,
        email : req.body.email,
        instagram : req.body.instagram,
        facebook : req.body.facebook,
        youtube : req.body.youtube,
        website : req.body.website,
        logo : req.files['logo'][0] ? req.files['logo'][0].path : '',
        hero_img : req.files['hero_img'][0] ? req.files['hero_img'][0].path : '',
        gallery_one : req.files['gallery_one'][0] ? req.files['gallery_one'][0].path : '',
        gallery_two : req.files['gallery_two'][0] ? req.files['gallery_two'][0].path : '',
        gallery_three : req.files['gallery_three'][0] ? req.files['gallery_three'][0].path : '',
        // galleries : req.files['galleries'] ? galleries_temp : [],

    })

    // console.log(req.files['logo'][0])

    await member.save()
    .then( result => {
        res.status(200).send({message : "data berhasil disimpan : " + result.id})
    })
    .catch( err => {
        res.status(409).send({
            message : "msg error :" + err.message || "some error while create new category data.",
        })

        if(req.files['logo'][0]) {
            fs.unlinkSync(path.join(req.files['logo'][0].path));
        }
        if(req.files['hero_img'][0]) {
            fs.unlinkSync(path.join(req.files['hero_img'][0].path));
        }
        if(req.files['gallery_one'][0]) {
            fs.unlinkSync(path.join(req.files['gallery_one'][0].path));
        }
        if(req.files['gallery_two'][0]) {
            fs.unlinkSync(path.join(req.files['gallery_two'][0].path));
        }
        if(req.files['gallery_three'][0]) {
            fs.unlinkSync(path.join(req.files['gallery_three'][0].path));
        }

        // if(req.files['galleries']) {
        //     for(let i = 0; i < req.files['galleries'].length; i++) {
        //         fs.unlinkSync(path.join(req.files['galleries'][i].path));
        //     }
            
        // }
    })
}

exports.show = async (req, res) => {
    await Member.findOne({
        _id : req.body.id
    })
    .then( result => {
        res.send(result)
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}

exports.delete = async (req, res) => {

    await Member.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        await Member.deleteOne({
        _id : result.id
        })
        .then( r => {
            res.send({r, msg : 'data berhasil dihapus'})
            fs.unlink(
                path.join(result.logo),
                (err) => console.log(err + ' file logo berhasil dihapus')
            );
            fs.unlink(
                path.join(result.hero_img),
                (err) => console.log(err + ' file hero berhasil dihapus')
            );
            fs.unlink(
                path.join(result.gallery_one),
                (err) => console.log(err + ' file gallery berhasil dihapus')
            );
            fs.unlink(
                path.join(result.gallery_two),
                (err) => console.log(err + ' file gallery berhasil dihapus')
            );
            fs.unlink(
                path.join(result.gallery_three),
                (err) => console.log(err + ' file gallery berhasil dihapus')
            );

            // for(let i = 0; i < result.galleries.length; i++){
            //     fs.unlink(
            //         path.join(result.galleries[i]),
            //         (err) => console.log(err + ' file gerombolan berhasil dihapus')
            //     );
            // }

        })
        .catch( err => {
            res.status(500).send({
                message : err.message || "some error while retreiving category data."
            })
        });
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}

exports.update = async (req, res) => {

    await Member.findOne({
        _id : req.body.id
    })
    .then( async (result) => {
        
        
        console.log('begining')

        console.log(result.logo)
        if(req.files['logo'] != undefined && result.logo != "") {
            fs.unlinkSync(path.join(result.logo));
            console.log('deleting one lg')
        } else {
            console.log('passed 1')
        }
        if(req.files['hero_img'] != undefined && result.hero_img != "") {
            fs.unlinkSync(path.join(result.hero_img));
            console.log('deleting one hr')
        } else {
            console.log('passed 2')
        }
        if(req.files['gallery_one'] != undefined && result.gallery_one != "") {
            fs.unlinkSync(path.join(result.gallery_one));
            console.log('deleting one 1')
        } else {
            console.log('passed 3')
        }
        if(req.files['gallery_two'] != undefined && result.gallery_two != "") {
            fs.unlinkSync(path.join(result.gallery_two));
            console.log('deleting one 2')
        } else {
            console.log('passed 4')
        }
        if(req.files['gallery_three'] != undefined && result.gallery_three != "") {
            fs.unlinkSync(path.join(result.gallery_three));
            console.log('deleting one 3 ')
        } else {
            console.log('passed 5')
        }

        await Member.updateOne({_id : result.id}, { 
            $set : {
                nama_provider : req.body.nama_provider ? req.body.nama_provider : result.nama_provider,
                dpc : req.body.dpc ? req.body.dpc : result.dpc,
                no_reg : req.body.no_reg ? req.body.no_reg : result.no_reg,
                nama_anggota : req.body.nama_anggota ? req.body.nama_anggota : result.nama_anggota,
                alamat : req.body.alamat ? req.body.alamat : result.alamat,
                telepon : req.body.telepon ? req.body.telepon : result.telepon,
                email : req.body.email ? req.body.email : result.email,
                website : req.body.website ? req.body.website : result.website,
                logo : req.files['logo'] ? req.files['logo'][0].path : result.logo,
                hero_img : req.files['hero_img'] ? req.files['hero_img'][0].path : result.hero_img,
                gallery_one : req.files['gallery_one'] ? req.files['gallery_one'][0].path : result.gallery_one,
                gallery_two : req.files['gallery_two'] ? req.files['gallery_two'][0].path : result.gallery_two,
                gallery_three : req.files['gallery_three'] ? req.files['gallery_three'][0].path : result.gallery_three,
            }
        } )
        .then( r => {
            res.status(200).send({message : "data berhasil diupdate"})
        })
        .catch( error => {
            res.status(409).send({
                message : "msg error :" + error.message || "some error while create new category data.",
            })

            
            if(req.files['logo'][0]) {
                fs.unlinkSync(path.join(req.files['logo'][0].path));
            }
            if(req.files['hero_img'][0]) {
                fs.unlinkSync(path.join(req.files['hero_img'][0].path));
            }
            if(req.files['gallery_one'][0]) {
                fs.unlinkSync(path.join(req.files['gallery_one'][0].path));
            }
            if(req.files['gallery_two'][0]) {
                fs.unlinkSync(path.join(req.files['gallery_two'][0].path));
            }
            if(req.files['gallery_three'][0]) {
                fs.unlinkSync(path.join(req.files['gallery_three'][0].path));
            }

            // if(req.files['galleries']) {
            //     for(let i = 0; i < req.files['galleries'].length; i++) {
            //         fs.unlinkSync(path.join(req.files['galleries'][i].path));
            //     }
                
            // }

        })
        
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });

    
}

exports.dashboard = async (req, res) => {

   
    let totalItems;

    await Member.find()
    .countDocuments()
    .then( async (r) => {
        totalItems = r

        return await Member.find()
        .populate({path: 'dpc', select:['kode_kategori', 'nama_kategori']})
        .sort({ updatedAt : -1 })
    })
    .then( result => {
        res.send({
            data : result,
            total_data : totalItems,
        })
    })
    .catch( err => {
        res.status(500).send({
            message : err.message || "some error while retreiving category data."
        })
    });
}