import mongoose, { Schema, Document } from 'mongoose';

export interface IOutbox extends Document {
  eventType: string;
  payload: object;
  createdAt: Date;
  processedAt?: Date;
}

const outboxSchema = new Schema<IOutbox>({
  eventType: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
});

export const OutboxModel = mongoose.model<IOutbox>('Outbox', outboxSchema);