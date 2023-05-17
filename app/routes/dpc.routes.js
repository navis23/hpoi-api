module.exports = app => {
    const dpcs = require("../controllers/dpc.controller");
    const r = require("express").Router();
    

    // const upload = multer({storage: storage});
    
 
    r.post("/daftar", dpcs.findAll);
    r.post("/simpan", dpcs.create);
    r.post("/detail", dpcs.show);
    r.post("/update", dpcs.update);
    r.post("/hapus", dpcs.delete);

    app.use("/hpoi-api/api/dpc", r);
}