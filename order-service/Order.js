const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products : [
        {
            product_id : String
        }
    ],
    user : String,
    total_price : Number,
    createdAt : {
        type : Date,
        default : Date.now()
    },
});

module.exports = Order = mongoose.model("order" , OrderSchema);