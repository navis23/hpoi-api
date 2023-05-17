module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_img : {
                type : String,
                required : true
            },
            provider: {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "members"
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
    return mongoose.model("memberImgs", schema);
    // return Category
}