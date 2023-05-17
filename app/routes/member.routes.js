module.exports = app => {
    const members = require("../controllers/member.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    
 
    r.post("/daftar", members.findAll);
    r.post("/simpan", members.create);
    r.post("/detail", members.show);
    r.post("/update", members.update);
    r.post("/hapus", members.delete);

    app.use("/hpoi-api/api/member", r);
}