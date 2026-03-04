import { Schema, model } from 'mongoose'

const UniverseSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
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

        premise: {
            type: String,
            required: true,
            trim: true,
        },

        rules: {
            type: [String],
            required: false,
        },

        notes: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

UniverseSchema.index(
    { name: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['DRAFT', 'ACTIVE'] },
        },
    }
)

export const UniverseModel = model('Universe', UniverseSchema)
