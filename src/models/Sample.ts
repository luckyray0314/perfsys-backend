import {Schema, model} from "mongoose";

const SampleSchema: Schema = new Schema ({
    sample: {
        type: String,
        required: true
    },
    location: {
        type: String
    }
});
const Sample = model("Sample", SampleSchema);
export default Sample;