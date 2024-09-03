import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema(
    {
        instituteId: {
            type: String,
            required: true
        },
        name: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
        instituteName:{
            type: String,
            required:true
        }
    },
    
    {
        timestamps: true,
    }
);

export default mongoose.model('User', FacultySchema);
