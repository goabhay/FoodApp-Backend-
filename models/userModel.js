

const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: email => emailValidator.validate(email),
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(confirmPassword) {
                return confirmPassword === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'restaurantowner', 'deliveryboy'], // restrict the values of particular field
        default: 'user'
    },
    profileImage: {
        type: String,
        default: 'img/users/default.jpg' // default image of user
    },
    resetToken: String
});

userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        this.confirmPassword = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    return resetToken;
};

userSchema.methods.resetPasswordHandler = function(password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined; // resetToken was just to facilitate the password change
};

const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;
