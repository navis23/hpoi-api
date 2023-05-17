module.exports = app => {
    const dpds = require("../controllers/dpd.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    
 
    r.post("/daftar", dpds.findAll);
    r.post("/simpan", dpds.create);
    r.post("/detail", dpds.show);
    r.post("/update", dpds.update);
    r.post("/hapus", dpds.delete);

    app.use("/hpoi-api/api/dpd", r);
}