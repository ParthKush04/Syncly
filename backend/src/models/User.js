import mongoose from 'mongoose';

const linkedinUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/.*$/i;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    googleId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null
    },
    linkedinId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null
    },
    profileImage: {
      type: String,
      trim: true,
      default: ''
    },
    linkedinUrl: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      sparse: true,
      default: undefined,
      set(value) {
        if (typeof value !== 'string') {
          return undefined;
        }

        const normalizedValue = value.trim();
        return normalizedValue || undefined;
      },
      validate: {
        validator(value) {
          return !value || linkedinUrlPattern.test(value);
        },
        message: 'Please provide a valid LinkedIn profile URL'
      }
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    profession: {
      type: String,
      trim: true,
      maxlength: [120, 'Profession cannot exceed 120 characters'],
      default: ''
    },
    company: {
      type: String,
      trim: true,
      maxlength: [120, 'Company cannot exceed 120 characters'],
      default: ''
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 20;
        },
        message: 'Interests cannot contain more than 20 items'
      }
    },
    networkingGoals: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return value.length <= 20;
        },
        message: 'Networking goals cannot contain more than 20 items'
      }
    },
    experienceLevel: {
      type: String,
      required: false,
      validate: {
        validator(value) {
          if (!value) {
            return true;
          }

          return ['student', 'entry', 'mid', 'senior', 'lead', 'executive'].includes(value);
        },
        message: 'Invalid experience level'
      },
      default: null
    },
    reputationScore: {
      type: Number,
      default: 0,
      min: [0, 'Reputation score cannot be negative'],
      max: [100, 'Reputation score cannot exceed 100']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    suspendedUntil: {
      type: Date,
      default: null
    },
    suspensionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Suspension reason cannot exceed 500 characters'],
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    authProvider: {
      type: String,
      required: [true, 'Auth provider is required'],
      enum: ['email', 'google', 'linkedin'],
      default: 'email'
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;