const User = require('../model/userModel')

function checkAuthorization(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(403).send('Access denied')
    }
}

const register =async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username: username})
        if (user) {
            res.send("Already exisits")
        }else{
            const newUser = await User.create({ username, password });
            // console.log(newUser);
            res.redirect('/login')
            // res.status(201).send('User registered successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

const login =async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username: username, password: password})
        if (user) {    
            req.session.username = user.username;
            res.redirect('/profile')
        }else{
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

const profile = async  (req, res) => {
    try {
        const receivedScore = req.body.score;
        // console.log(req.session._id,"Hel");
        const user = await User.findOne({ username: req.session.username });
        const currentScore = user.score
        const updatedChances = user.chances > 0 ? user.chances - 1 : 0;
        const newScore = currentScore + receivedScore;
        const updateResult = await User.updateOne(
            { username: req.session.username },
            { $set: { score: newScore, chances: updatedChances } }
        )
        // console.log();
        // console.log('Received score:', receivedScore);
        // console.log('Received chances:', updatedChances);
        res.json({ message: 'Data received successfully', data: receivedScore });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

const getData = async (req, res) => {
    try {
        const sortOption = req.body.sortOption;
        let sortedData;
        if (!sortOption || sortOption === 'normal') {
            sortedData = await User.find();
        } 
        else if (sortOption === 'chances') {
            sortedData = await User.find().sort({ chances: -1 });
        } else if (sortOption === 'score') {
            sortedData = await User.find().sort({ score: -1 });
        } else {
            // Handle invalid sort options
            return res.status(400).json({ error: 'Invalid sort option' });
        }
        res.json(sortedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getScore = async (req, res) => {
    try {
        // console.log(req.session.username);
        const user = await User.findOne({ username: req.session.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // console.log('Fetched user score:', user);  // Debug log
        res.json(user);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {register, login, profile, checkAuthorization, getData, getScore }