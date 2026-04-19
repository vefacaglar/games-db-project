import mongoose, { Schema, Document } from 'mongoose';
import { IList } from '../../../domain/entities/IList.js';

export interface ListDocument extends Omit<IList, '_id' | 'user'>, Document {
  user: mongoose.Types.ObjectId;
}

const ListSchema = new Schema<ListDocument>(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
  },
  { timestamps: true }
);

export const ListModel = mongoose.model<ListDocument>('List', ListSchema);