// MUSTDO: Re add login stuff on api

var express = require('express');
var passport = require('passport');
var Account = require('./models/account');
var Routine = require('./models/routine');
var Athlete = require('./models/athlete');
var Skill = require('./models/skill');
var router = express.Router();

var loggedIn = function (req, res, next) {
    if (req.user)
        next();
    else
        res.redirect('/login');
}

var getModel = function (modelName) {
    var model; // Initialize it here

    // Check if it is a type we can deal with
    switch (modelName) {
        case 'Routine':
            model = Routine;
            break;
        case 'Athlete':
            model = Athlete;
            break;
        case 'Skill': 
            model = Skill;
            break;
        default:
            return;
    }
    return model;
}

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.status(400).send(err);
        }

        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
                status: 'Registration successful!',
                accountID : account._id
            });
        });
    });
});

router.get('/login', function (req, res) {
    res.sendFile('/Users/richardmack/Cheerplanner/client/login.html');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function (err, account, info) {
        if (err)
            return next(err);
        if (!account)
            return res.status(401).json({err : info});
        req.logIn(account, function (err) {
            if (err) 
                return res.status(500).json({err : 'Could not log in user'});
            res.status(200).json({status : 'Login successful', accountID : account._id});
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({status : 'Bye'});
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

router.post('/Account/', function (req, res) {
    console.log('hit it');
    //var userID = req.user._id;
    var id = req.user._id;
    var config = req.body.config;
    if (!config)
        return;
    Account.findOneAndUpdate({_id : id}, {$set : {config : config}}).then(function (result) {
        return res.status(200).send('Successfully updated config for user ' + result.username);
    }).catch(function (err) {
        return res.status(400).json({error : err})
    });
});

router.get('/Account/', function (req, res) {
    var userID = req.user._id;
    return Account.findOne({_id : userID}).then(function (result) {
        return res.status(200).json(result.config);
    }).catch(function (err) {
        console.log(err);
        return res.status(400).json({error : err});
    });
});

router.get('/:type/:id?/', function (req,res) {
    var include; // Initialize it here
    var model = getModel(req.params.type);
    if (!model)
        return res.status(400).json({error : 'No Models of that type exist'});

    query = {accountID : req.user._id}; // MUSTDO: Add auth restriction here (using user._id and accountID in Mongo)
    console.log(query);
    if (req.params.id)
        query.id = req.params.id;
    else
        include = {name : 1, id : 1, lastModified : 1};
    
    return model.find(query, include).then(function (result) {
        if (result[0] && req.params.type == 'Routine' && req.params.id) { // If getting a specific routine, then grab the Athletes too
            //if (!result[0]) // If there is no matching routine
            //    return res.status(200).json({routine : new Routine({id : req.params.id}), athletes : []});
            var returnObj = {};
            returnObj.routine = result[0];
            return Promise.all(
                returnObj.routine.athletes.map(function (athleteID) {
                    return Athlete.findOne({id : athleteID, accountID : req.user._id})
                }))
            .then(function (arrayOfAthletes) {
                returnObj.athletes = arrayOfAthletes;
                return res.status(200).json(returnObj);
            });
        }
        return res.status(200).json(result);
    }).catch(function (err) {console.log(err);});
});

router.post('/:type/', function (req, res) {
    // Check if it is a type we can deal with
    var model = getModel(req.params.type);

    if (!model)
        return res.status(400).json({error : 'Unrecognized Model Type'});

    var modelsToSave = Array.isArray(req.body.data) ? req.body.data : [req.body.data];
    //console.log('Models To Save: ' + JSON.stringify(modelsToSave));
    return Promise.all(
        modelsToSave.map(function (modelToSave) {
            //console.log('Model Currently being Saved: ' + JSON.stringify(modelToSave));
            //console.log(modelToSave.id);
            if (!modelToSave.id) {
                return Promise.reject('Must specify an ID');
            }
            if (!modelToSave.name.trim())
                return Promise.reject('Name may not be entirely whitespace');
            var tempModel = {};
            //console.log(Object.getOwnPropertyNames(modelToSave));
            Object.getOwnPropertyNames(modelToSave).forEach(function (propertyName) {
                if (propertyName[0] != '_') // Only move over the properties which aren't prefixed by '_' (mongo internal or non-persist)
                    tempModel[propertyName] = modelToSave[propertyName];
            });
            // MUSTDO: Add this back in
            tempModel.accountID = req.user._id;
            tempModel.lastModified = new Date();
            console.log('Temp Model: '+JSON.stringify(tempModel));
            return model.findOneAndUpdate({id : modelToSave.id, accountID : req.user._id}, tempModel, {upsert : true, new : true})
        })

        ).then(function (arrayOfResults) {return res.status(200).json(arrayOfResults);
        }).catch(function (err) {return res.status(400).json({error : err})});
});

module.exports = router;