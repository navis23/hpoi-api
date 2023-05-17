module.exports = mongoose => {

    const { Schema } = mongoose;

    const schema = new Schema(
        {
            kode_provider : {
                type : String,
                required : true
            },
            nama_provider : {
                type : String,
                required : true
            },
            no_reg : {
                type : String,
                required : true
            },
            nama_anggota: {
                type : String,
                required : true,
            },
            profile_one: {
                type : String,
                required : true,
            },
            profile_two: {
                type : String,
                required : true,
            },
            services: {
                type : Array,
                required : true,
            },
            alamat: {
                type : String,
                required : true, 
            },
            telepon: {
                type : String,
                required : true,
            },
            email: {
                type : String,
                required : true,
            },
            instagram: {
                type : String,
                required : true,
            },
            facebook: {
                type : String,
                required : true,
            },
            youtube: {
                type : String,
                required : true,
            },
            website: {
                type : String,
                required : true,
            },
            dpc: {
                type : mongoose.SchemaTypes.ObjectId,
                ref : "dpcs"
            },
            logo : {
                type : String,
            },
            hero_img : {
                type : String,
            },
            gallery_one : {
                type : String,
            },
            gallery_two : {
                type : String,
            },
            gallery_three : {
                type : String,
            },
            // galleries : {
            //     type : mongoose.SchemaTypes.ObjectId,
            //     ref : "members"
            // },
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
    return mongoose.model("members", schema);
    // return Category
}