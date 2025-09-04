const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tenant name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [100, 'Email cannot exceed 100 characters'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    apartmentNumber: {
        type: String,
        required: [true, 'Apartment number is required'],
        trim: true,
        maxlength: [20, 'Apartment number cannot exceed 20 characters']
    },
    checkinDate: {
        type: Date,
        required: [true, 'Check-in date is required']
    },
    checkoutDate: {
        type: Date,
        default: null
    },
    rentalBasis: {
        type: String,
        required: [true, 'Rental basis is required'],
        enum: ['monthly', 'daily'],
        default: 'monthly'
    },
    rentAmount: {
        type: Number,
        required: [true, 'Rent amount is required'],
        min: [0, 'Rent amount cannot be negative']
    },
    deposit: {
        type: Number,
        default: 0,
        min: [0, 'Deposit cannot be negative']
    },
    bookingSource: {
        type: String,
        enum: ['online', 'in-person', 'call', 'travel-agent', 'other', ''],
        default: ''
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot exceed 500 characters'],
        default: ''
    },
    remarks: {
        type: String,
        maxlength: [1000, 'Remarks cannot exceed 1000 characters'],
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    idVerification: {
        type: String,
        enum: ['verified', 'pending', 'not-verified'],
        default: 'pending'
    },
    currentRentalPeriod: {
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        }
    },
    totalRent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating rental duration
tenantSchema.virtual('rentalDuration').get(function() {
    if (!this.checkinDate) return 0;
    const endDate = this.checkoutDate || new Date();
    const diffTime = Math.abs(endDate - this.checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for calculating total rent
tenantSchema.virtual('calculatedTotalRent').get(function() {
    if (this.rentalBasis === 'daily') {
        return this.rentAmount * this.rentalDuration;
    }
    return this.rentAmount;
});

// Index for better query performance
tenantSchema.index({ apartmentNumber: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ checkinDate: -1 });
tenantSchema.index({ name: 'text', email: 'text' });

// Pre-save middleware to update total rent
tenantSchema.pre('save', function(next) {
    this.totalRent = this.calculatedTotalRent;
    next();
});

// Static method to get dashboard statistics
tenantSchema.statics.getDashboardStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalTenants: { $sum: 1 },
                activeTenants: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                totalRevenue: { $sum: '$totalRent' },
                averageRent: { $avg: '$rentAmount' }
            }
        }
    ]);
    
    return stats[0] || {
        totalTenants: 0,
        activeTenants: 0,
        totalRevenue: 0,
        averageRent: 0
    };
};

// Instance method to mark tenant as inactive
tenantSchema.methods.checkout = function(checkoutDate = new Date()) {
    this.checkoutDate = checkoutDate;
    this.status = 'inactive';
    return this.save();
};

module.exports = mongoose.model('Tenant', tenantSchema);

