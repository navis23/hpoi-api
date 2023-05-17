module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_dpc : {
                type : String,
                required : true
            },
            nama_dpc: {
                type : String,
                required : true,
            },
            dpd: {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "dpds"
            },
        }, {
            timestamps : true
        }
    );

    schema.method("toJSON", function() {
        const {__v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    });

    // const Category = mongoose.model("categories", schema);
    return mongoose.model("dpcs", schema);
    // return Category
}