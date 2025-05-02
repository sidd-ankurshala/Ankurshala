const mongoose = require('mongoose')

const TableSchema = mongoose.Schema({
    user_Id: {
        type: mongoose.Types.ObjectId,
        index: true
    },
    paper_code: {
        type: mongoose.Types.ObjectId,
        index: true,
    },
    uniqueId:{
        type:String,
        index:true
    },
    ques: {
        type: JSON
    },
    submitted: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_pause:{
        type:Boolean,
        default:false
    },
    timer:{
        type:Number,
        default: 0
    },
    latitude: String,
    longitude: String,
    photo_proof: String,
    id_proof: String,
    assigned_username: String,
    assigned_name: String,
    images: { type: Array, default: [] },
    result: { type: Object, index: true, default: {} },
    paper_type: { type: String, index: true },
    recent_ques: { type: String },
    msgs : {type: Array, default:[]},
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
},{
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 20000
    }
});

TableSchema.index({
    user_Id: 1,
    paper_code: 1,
    paper_type: 1
});


const Table = mongoose.model('QuestionMap', TableSchema);

// Table.createIndexes()
// Table.ensureIndexes()

module.exports = Table
