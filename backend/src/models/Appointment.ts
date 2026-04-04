import mongoose, { Model, Schema, model, models } from "mongoose";

export enum AppointmentStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IAppointment {
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  id?: string;
}

const appointmentSchema = new Schema<IAppointment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(AppointmentStatus), 
    default: AppointmentStatus.UPCOMING 
  },
}, { timestamps: true });

appointmentSchema.virtual('id').get(function() { return this._id.toHexString(); });
appointmentSchema.set('toJSON', { virtuals: true });

appointmentSchema.index(
  { providerId: 1, date: 1, timeSlot: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { status: AppointmentStatus.UPCOMING } 
  }
);


const AppointmentModel: Model<IAppointment> =
  models.Appointment || model<IAppointment>("Appointment", appointmentSchema);

export default AppointmentModel;

