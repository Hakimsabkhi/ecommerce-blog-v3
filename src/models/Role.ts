// src/models/Role.ts
import mongoose, { Document, Schema, Model } from 'mongoose';
import { getAllDashboardPaths } from '@/lib/page'; // Import the flatten function

export interface IRole extends Document {
  name: string;
  access: Map<string, boolean>;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    access: {
      type: Map,
      of: Boolean, // The Map has string keys, boolean values
      default: {}, // Start empty
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook to set default access for "Admin" or "Visiteur".
 * - If new doc is "Admin" -> all paths => true
 * - If "Visiteur" -> all paths => false
 */
RoleSchema.pre<IRole>("save", function (next) {
  // Only do this if the doc is new AND "access" is empty
  if (this.isNew && (!this.access || this.access.size === 0)) {
    const allPaths = getAllDashboardPaths();

    if (this.name === "Admin") {
      allPaths.forEach((path) => {
        this.access.set(path, true);
      });
    } else if (this.name === "Visiteur") {
      allPaths.forEach((path) => {
        this.access.set(path, false);
      });
    } else {
      // Default logic for other roles (e.g. "SuperAdmin"), 
      // or just leave it empty if you want to fill it manually later.
      // For example:
      allPaths.forEach((path) => {
        this.access.set(path, false); // or true, or partial logic
      });
    }
  }
  next();
});

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);
export default Role;
