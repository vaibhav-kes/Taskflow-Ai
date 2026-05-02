const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project creator is required'],
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['planning', 'active', 'completed', 'on-hold'],
        message: '{VALUE} is not a valid project status',
      },
      default: 'planning',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
projectSchema.index({ createdBy: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ teamMembers: 1 });

/**
 * Pre-save hook — ensure creator is always in teamMembers
 */
projectSchema.pre('save', function () {
  if (
    this.createdBy &&
    !this.teamMembers.some((member) => member.equals(this.createdBy))
  ) {
    this.teamMembers.push(this.createdBy);
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
