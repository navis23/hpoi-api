module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_dpd : {
                type : String,
                required : true
            },
            nama_dpd : {
                type : String,
                required : true,
            }
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
    return mongoose.model("dpds", schema);
    // return Category
}