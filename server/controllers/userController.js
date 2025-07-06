const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');//user model 
const validator = require("validator");


//secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET_KEY;

//for production and dev diff
const isProd = process.env.NODE_ENV === 'prod';

//domain in prod
const DOMAIN = process.env.DOMAIN;

//get users API
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("name reg_no aura_points");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Register user API
const register = async (req, res) => {
    try {
        const { name, reg_no, email, password } = req.body;


        //check if the user already exists
        let user = await userModel.findOne({ reg_no });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!name || !reg_no || !email || !password)
            return res.status(400).json({ message: 'All fields are required . . .s' });

        //to do  -> //validate reg_no || if db access 

        if (!validator.isEmail(email))
            return res.status(400).json({ message: 'Invalid email' });
        if (!validator.isStrongPassword(password))
            return res.status(400).json({ message: 'Weak password' });


        // create a new user
        user = new userModel({ name, reg_no, email, password });

        //first time bonus

        user.aura_points = 10 ;
        
        await user.save();

        res.status(201).json({ name, reg_no, email });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// login user API
const login = async (req, res) => {
    const { id, password, rememberMe } = req.body;


    try {

        let user = null;

        if (!isNaN(Number(id)))
            user = await userModel.findOne({ reg_no: id });
        else
            user = await userModel.findOne({ email: id });

        if (!user) {
            return res.status(404).json({ message: 'No user exists' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong Password' });
        }

        // set the token expiration based on "Remember Me"
        const tokenExpiry = rememberMe ? '7d' : '1h'; // 7 days if "Remember Me" is checked, 1 hour if not



        // generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: tokenExpiry });

        const cookieOptions = {
            httpOnly: true, // send the token as an HttpOnly cookie
            secure: isProd, // set to true in production with HTTPS
            sameSite: isProd ? 'none' : 'lax', // 'none' for cross-origin in prod, 'lax' works in dev
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000 // 7 days or 1 hour in milliseconds

        }
        if (isProd) {
            cookieOptions.domain = DOMAIN;
        } else {
            delete cookieOptions.domain;
        }

        res.cookie('token', token, cookieOptions);

        res.status(200).json({ name: user.name, reg_no: user.reg_no, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// coordinator login user API
const coordinatorLogin = async (req, res) => {
    const { id, password } = req.body;

    try {

        if (!id || !password) {
            return res.status(400).json({ message: 'Fill the required fields.' });
        }

        const coordinatorId = process.env.COORDINATOR_ID;
        const coordinatorPassword = process.env.COORDINATOR_PASSWORD;

        // console.log(id);
        // console.log(password);

        if (coordinatorId !== id || coordinatorPassword !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // req.session.isCoordinator = true;  // Store session value

        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error in coordinatorLogin:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Profile fetch API - own
const getProfile = async (req, res) => {
    try {
        const _id = req.user._id; //get _id from the authenticated user
        const user = await userModel.findOne({ _id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return user profile details without the password
        const { password, ...profile } = user.toObject();
        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Profile fetch API - others
const getOtherUserProfile = async (req, res) => {
    try {
        const reg_no = req.params.reg_no; //get _id from the authenticated user
        // console.log(reg_no)
        const userProfile = await userModel.findOne({ reg_no: reg_no }).select("_id name reg_no email aura_points");

        // console.log(userProfile);

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ userProfile });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Profile edit API using PATCH
const editProfile = async (req, res) => {
    try {
        const _id = req.user._id; //get email from the authenticated user

        //directly use req.body for update while ensuring to omit sensitive fields
        const updateData = req.body;

        // console.log(_id);

        // update user profile details
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id },
            { $set: updateData }, // Use req.body directly
            { new: true } // Return the updated document
        );

        // console.log(updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        //return updated user profile details without the password
        const { password, ...profile } = updatedUser.toObject();
        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// change password API
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const _id = req.user._id;  // get the user ID from the authenticated user

        // find the user by ID
        const user = await userModel.findById(_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // console.log(oldPassword);

        // check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        if (!validator.isStrongPassword(newPassword))
            return res.status(400).json({ message: 'Weak password' });

        user.password = newPassword;

        // save the updated user
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// logout API
const logout = async (req, res) => {

    try {

        const clearOptions = {
            httpOnly: true,
            sameSite: isProd ? 'none' : 'lax',
            secure: isProd,
        };

        if (isProd) {
            clearOptions.domain = DOMAIN;
        }

        //clears the cookie
        res.clearCookie('token', clearOptions);

        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        return res.status(500).json(err.message);
    }

}


module.exports = { getUsers, login, register, logout, getProfile, getOtherUserProfile, editProfile, changePassword, coordinatorLogin };
