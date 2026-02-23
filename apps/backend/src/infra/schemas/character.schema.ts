import { Schema, model } from 'mongoose'

const CharacterSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    status: {
        type: String,
        required: true,
        enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
    },

    categories: {
        type: [String],
        required: true,
        default: []
    },

    identity: {
        type: String,
        required: true,
    },

    inspirations: {
        type: [String],
        required: true,
        default: []
    },

    notes: {
        type: String,
        required: false,
    },

    image: {
        type: String,
        required: false,
    },
},
    {
        timestamps: true,
        versionKey: false
    }
)

CharacterSchema.index(
    { name: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['DRAFT', 'ACTIVE'] },
        },
    }
)

export const CharacterModel = model('Character', CharacterSchema)