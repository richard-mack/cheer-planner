'use strict';
angular.module('Cheerleaders').
controller('routineController', ['$scope', '$http', '$location', '$timeout', 'AuthService', '$routeParams', function($scope, $http, $location, $timeout, AuthService, $routeParams) {
  // Declare a bunch of stuff which needs to be initialized.
  $scope.routine; $scope.athletes; $scope.athletePositions; $scope.currentCountNote;
  $scope.hashtagMapping = {};
  $scope.topLeft = {left : 50, top : 50};
  $scope.matWidth = 100;
  $scope.matHeight = $scope.matWidth*20/3
  $scope.deleteRegion = {left : 1090, top : 50 + $scope.matHeight}
  $scope.deletedAthletes = [];
  $scope.Math = Math;
  $scope.viewingCount = false;
  $scope.addingAthlete = false;
  $scope.newRoutine = false;
  $scope.viewingCountData = null;
  $scope.isDragging = null;
  $scope.isSaving = false;
  $
  // Load the routine data from the server. Populate the hashtag map
  

  $scope.currentCount = 0;

  $scope.goHome = function () {
    $scope.save();
    $location.path('/');
  }

  $scope.getRoutineData = function () {
    $scope.routine = $scope.hashtagMapping = {};
    $scope.deletedAthletes = [];
    $http({
      method : 'GET',
      url : 'api/Routine/'+$routeParams.id
    }).success(function (data, status, headers, config) {
      $scope.routine = data.routine;
      $scope.athletes = data.athletes;
      $scope.athletePositions = $scope.getAthletePositions();
      return; 
    }).catch(function (err)
    {
      console.log(err);
    });
  }

  $scope.getRoutineData();
  /**
   * Creates a 32 character ID
   * @param {Object} options This that we may want as settings at some point
   * @return {String} A 16 character alphanumeric
   */
  $scope.createID = function (options) {
    var id = "";
    if (options && options.prefix)
      id += options.prefix.slice(0,32);
    id += (new Date()).getTime().toString(36);
    while (id.length < 32) {
      id += Math.floor(Math.random()*36).toString(36);
    }
    return id;
  }

  /**
   * Takes an athlete id and returns the count object with that athlete id 
   * that has the greatest count that is smaller than the current count
   * @param  {[String]} athleteID A string defining an athlete
   * @return {[Count | null]}     A count object with that athleteID. If done properly,
   *                              returns null only in the case that the athlete does not exist
   */
  $scope.lastKnownCount = function (athleteID) {
    // Early exit if routine not loaded
    if (!$scope.routine || !$scope.routine.counts)
      return;

    var maxCount = {count : -1};
    $scope.routine.counts.forEach(function (count) {
      if (count.athleteID == athleteID && count.count >= maxCount.count && count.count <= $scope.currentCount)
        maxCount = count;
    });
    return maxCount;
  }
  $scope.getAthletePositions = function () {
    // Early exit if routine hasn't loaded yet
    if (!$scope.routine || !$scope.athletes)
      return; 
    var returnArray = [];
    var unusedHeight = 15;
    var unusedCount = 0;
    var athleteList = $scope.athletes.sort(function (a,b) {return a.name > b.name});
    // The athlete list is now sorted alphabetically. This is a bit important
    athleteList.forEach(function (athlete) {
      var lastKnown = $scope.lastKnownCount(athlete.id);

      if (lastKnown.count == 0) {
        lastKnown.posx = 1090;
        lastKnown.posy = 65 + unusedHeight*unusedCount;
        unusedCount++;
      }

      returnArray.push({athlete : athlete, count : lastKnown});
    });
    return returnArray;
  }

  /**
   * Prompts the user for the name of a new athlete, then creates an athlete with that name.
   * Adds the athlete to the unused athlete list at count 0
   */
  $scope.addAthlete = function () {
    if (!this.addingAthlete.firstName)
      return;
      // Check to see that there are any counts. If not, that may be an issue
    if (!$scope.routine.counts[0])
      $scope.routine.counts = []

    var posy = Math.max.apply(Math, $scope.counts.filter(function (c) {return c.count == 0}).map(function (c) {return c.posy ? c.posy : 0}).concat([65])) + 15;

    $scope.routine.counts.push({
      athleteID : this.addingAthlete.id, 
      posx : 1090, 
      posy : posy, 
      note : 'Unused Spot',
      count : 0
    });
    $scope.athletes.push({
      firstName : this.addingAthlete.firstName,
      lastName : this.addingAthlete.lastName,
      name : this.addingAthlete.firstName + ' ' + this.addingAthlete.lastName,
      id : this.addingAthlete.id,
      skills : this.addingAthlete.skills,
      position : this.addingAthlete.position
    });
    this.addingAthlete = null;
    return;
  }

  /**
   * Removes the given athlete from the local data and marks it to be deleted from the server
   * @param  {[String]} athleteID The ID of the athlete which is to be delted
   */
  $scope.deleteAthlete = function (athleteID) {
    // Delete from local storage
    $scope.athletes = $scope.routine.athletes.filter(function (athlete) {return athlete.id != athleteID});
    $scope.routine.counts = $scope.routine.counts.filter(function (count) {return count.athleteID != athleteID});
    // Tag for deletion on save.
    $scope.deletedAthletes.push(athleteID);
  }

  /**
   * Prompts the user for a name for a new routine, then saves the current routine and navigates to a new one
   */
  $scope.addRoutine = function () {
    if (!this.newRoutine)
      return;
    $scope.save(); // Save the one you are at right now
    $location.url(this.newRoutine)
    $scope.getRoutineData()
    this.newRoutine = '';
  }

  /**
   * Saves the current routine
   * @return {[boolean]} Returns true if successful
   * COULDDO: Make it have a reasonable return value if save fails
   */
  $scope.save = function () {
    $scope.isSaving = true;
    // We need to make sure our data is all in the right format.
    $scope.athletes.forEach(function (athlete) {
      athlete.name = athlete.firstName + ' ' + athlete.lastName;
      if (!athlete.id)
        athlete.id = $scope.createID({prefix : 'A'});
      delete athlete._id; // Mongo internal field
      delete athlete.__v; // Mongo internal field
    });

    delete $scope.routine._id;
    delete $scope.routine.__v;

    return Promise.all([
        $http({
      method : 'POST',
      url : 'api/Athlete/',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {data : $scope.athletes},
    }).success(function (data, status, headers, config) {console.log(data); return true;}),
        $http({
          method: 'POST',
          url : 'api/Routine/',
          headers : {
            'Content-Type' : 'application/json'
          },
          data : {data : $scope.routine},
        }).success(function (data) {$scope.isSaving = false; return true;})
    ]);
  }

  $scope.startDragging = function () {
    $scope.isDragging = {left : 0, top : 0};
    $scope.$apply();
  }

  $scope.stopDragging = function ($event, $ui) {
    var id = $ui.helper[0].id;
    $scope.isDragging = null;
    var posx = $ui.helper[0].offsetLeft;
    var posy = $ui.helper[0].offsetTop;

    // First, check if it is a valid place to put the item.
    if (!($scope.currentCount == 0 ||
      posx < $scope.topLeft.left || 
      posy < $scope.topLeft.top || 
      posx > ($scope.topLeft.left+9*($scope.matWidth+1)) || 
      posy > $scope.matHeight + $scope.topLeft.top)) {


      var lastKnownCountForId = $scope.lastKnownCount(id);
    if (lastKnownCountForId.count != $scope.currentCount) {
      $scope.routine.counts.push({
        count : $scope.currentCount,
        athleteID : id,
        note : '',
        posx : posx,
        posy : posy
      });
    }
    else {
      lastKnownCountForId.posx = posx;
      lastKnownCountForId.posy = posy;
    }
  }
  $scope.$apply();
  return;
}

  $scope.onDrag = function ($event, $ui) {
    $scope.isDragging.left = $ui.helper[0].offsetLeft + ($ui.helper[0].offsetWidth / 2)  ;
    $scope.isDragging.top = $ui.helper[0].offsetTop + ($ui.helper[0].offsetHeight / 2);
    $scope.$apply();
  }
  /**
   * Sets the count to the one specified by count
   * @param  {[String | Number]} count  If number, a raw count. Also allows [8-count]:[1-count] or hashtag
   */
  $scope.jumpToCount = function (count) {
    // Ensure that count is a string. Extra effort? Extra effort! COULDDO: Make the logic more clear here
    count = count.toString();
    // Early exit if count is a blank string
    if (count == '')
      return;
    // Check how it was entered      
    if (count.indexOf(':') == -1) { // If this passes, it is a number or a string
      var parsedCount = parseInt(count);
      if (parsedCount >= 0) { // If it is a number, then parseInt will get it 
        if (parsedCount > 5000)
          throw new Error('Routines can be at most 5000 counts long');
        if (parsedCount < 0)
          parsedCount = 0;
      } else { // count is a string. Search through counts for something with this tag
        parsedCount = this.hashtagMapping[count];
        if (!parsedCount)
          throw new Error('No count with that tag was found');
      }
      count = parsedCount; // Set count to be the number
    } else {
      var splitCount = count.split(':');
      if (splitCount[1].indexOf(':') > -1)
        throw new Error('Only one colon allowed in count');
      count = parseInt(splitCount[0])*8 + parseInt(splitCount[1]);
    }
    // Finally, go to the next count and update the count note
    $scope.currentCount = count;
    $scope.athletePositions = $scope.getAthletePositions();
    $scope.currentCountNote = this.lastKnownCount('note').note; // Need to update the value here, since we only want to update it when changing counts
  }

  /**
   * Triggers on adding a character to the count input. Watches for enter for submittal
   * Currently allows a-z A-Z 0-9
   * @param  {[object]} $event The event returned by the browser on a keypress
   * @return {[boolean]}        True if the character is acceptable, false if it is not
   */
  $scope.countInputKeypress = function ($event) {
    var charCode = (typeof $event.which == 'number') ? $event.which : $event.keyCode;
    if (charCode == 13)
    {
      this.jumpToCount($($event.target)[0].value);
      $($event.target)[0].value = '';
      return true;
    }
    if ((charCode >= 48 && charCode <= 58) || (charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90))
      return true;
    else {
      console.log(charCode);
      $event.preventDefault();
      return false;
    }
  }

  /**
   * Triggers on adding a character to the note input
   * Currently allows alphanumeric input plus basic symbols
   * SHOULDDO: Refactor to improve how notes are stored.
   * @param  {[object]} $event The event returned by the browser on keyup
   * @return {[boolean]}        True if the character added is acceptable, false if not
   */
  $scope.updateCountNote = function ($event) {
    // Early exit if not a reasonable character
    var charCode = (typeof $event.which == 'number') ? $event.which : $event.keyCode;
    if (charCode < 32 || charCode > 126)
    {
      $event.preventDefault()
      return false;
    }
    // Update the note for that count.
    var noteToUpdate = $scope.routine.counts.find(function (c) {return (c.athleteID == 'note' && c.count == $scope.currentCount)});
    if (!noteToUpdate) {
      $scope.routine.counts.push({
        athleteID : 'note',
        id : $scope.createID({prefix : 'N'}),
        routineID : $scope.routine.id,
        count : $scope.currentCount,
        note : $($event.target)[0].value
      })
    } else {
      noteToUpdate.note = $($event.target)[0].value;
    }

    // Update hashtags
    // Delete all hashtags on this count
    var hashtagsToDelete = Object.keys(this.hashtagMapping).filter(function (key) {return $scope.hashtagMapping[key] == $scope.currentCount});
    console.log(hashtagsToDelete);
    hashtagsToDelete.forEach(function (tag) {delete $scope.hashtagMapping[tag];});
    this.updateHashtags(noteToUpdate);
    return true;
  }

  /**
   * Listens for various keypresses on the main document
   * Listens for arrows when the count viewer is not open, adjusting the count accordingly
   * Listens for the esc key when the count viewer is open, closing it
   * Disabled if viewing a single count
   * @param  {[object]} $event Event object returned by the browser on keypress
   * @return {[type]}        Returns true
   */
  $scope.listenKeys = function ($event) {
    var charCode = (typeof $event.which == 'number') ? $event.which : $event.keyCode;

    if (this.viewingCount || this.addingAthlete || this.newRoutine) {
      if (charCode == 27) {
        this.viewingCount = false;
        this.viewingCountData = null;
        this.addingAthlete = false; 
        this.newRoutine = '';
      }
      return true;
    }

    switch (charCode) {
      case 38: // Up arrow
      this.jumpToCount($scope.currentCount + 1);
      break;
      case 40: // Down Arrow
      this.jumpToCount($scope.currentCount - 1);
      break;
      case 39: // Right arrow
      this.jumpToCount($scope.currentCount + 8);
      break;
      case 37: // Left arrow
      this.jumpToCount($scope.currentCount - 8);
      break;
    }
    return true;
  }

  /**
   * Populates the viewingCountData object with information about the specified count and triggers the viewer to show
   * @param  {[object]} $event The event provided by the browser on click
   */
  $scope.showCount = function ($event) {
    if ($scope.isDragging)
      return;
    console.log($scope.isDragging);
    console.log($event);
    var athleteID = $event.target.id;
    var countObj = $scope.lastKnownCount(athleteID);
    var athleteObj = $scope.athletes.find(function (a) {return a.id == athleteID})
    // We want to make sure that we aren't passing a reference. Changes should save on closing the window, not on the fly.
    $scope.viewingCountData = {
      firstName : athleteObj.firstName,
      lastName : athleteObj.lastName,
      athleteID : countObj.athleteID,
      count : countObj.count,
      note : countObj.note
    }
    $scope.viewingCount = true;
  }

  /**
   * Saves the viewingCountData which is currently being viewed. Done this way to avoid issues with binding and comments
   * on information loaded from a previous count
   */
  $scope.saveViewingCount = function () {
    var athlete = $scope.athletes.find(function (a) {return a.id == $scope.viewingCountData.athleteID});;
    var oldCountData = $scope.lastKnownCount(athlete.id);

    var countToModify = $scope.routine.counts.find(function (c) {return (c.count == $scope.currentCount && c.athleteID == athlete.id)})
    if (!countToModify) {
      var newLength = $scope.routine.counts.push(oldCountData);
      countToModify = $scope.routine.counts[newLength - 1];
    }
    countToModify.count = $scope.currentCount;
    countToModify.note = $scope.viewingCountData.note;
    athlete.firstName = $scope.viewingCountData.firstName;
    athlete.lastName = $scope.viewingCountData.lastName;
    athlete.name = athlete.firstName + ' ' + athlete.lastName;
    this.viewingCountData = null;
    this.viewingCount = false;
  }

  /**
   * Updates the hashtag map that goes to a specific count
   * @param  {[type]} count [description]
   * @return {[type]}       [description]
   */
  $scope.updateHashtags = function (count) {
    var tags = count.note.split('#').slice(1).map(function (t) {return t.trim()});
    for (var i = 0; i < tags.length; i++) {
      if (!this.hashtagMapping.hasOwnProperty(tags[i]))
        this.hashtagMapping[tags[i]] = count.count;
      else
        throw new Error('Duplicate tags on counts ' + count.count + ' and ' + this.hashtagMapping[tags[i]]);
    }
  }

  // SHOULDDO: Improve error handling so users can see the errors
  // SHOULDDO: Allow renaming of routines

    
}]).controller('routineIndexController', ['$scope', '$location', '$http', 'AuthService', function ($scope, $location, $http, AuthService) {
  $scope.routines = [];
  // SHOULDDO: Allow renaming of routines
  // SHOULDDO: Allow deletion of routines

  $scope.getRoutines = function () {
    $http({
      method : 'GET',
      url : 'api/Routine',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }).then(function (success){
      $scope.routines = success.data.map(function (routine) {return {id : decodeURI(routine.id), name : decodeURI(routine.name), lastModified : routine.lastModified}});
    }).catch(function (err) {console.log(err)})
  }

  $scope.loadRoutine = function (routineID) {
    $location.path('/routine/'+routineID);
  }
}]).controller('registerController', ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
    $scope.username = $scope.password = '';

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.username, $scope.password)
        // handle success
        .then(function () {
          console.log('success');
          $location.path('/login');
          $scope.disabled = false;
          $scope.username = $scope.password = '';
        })
        // handle error
        .catch(function (err) {
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.username = $scope.password = '';
          console.log(err);
        });

    };
}]).controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
  $scope.username = '';
  $scope.password = '';
  $scope.disabled = true;
  $scope.login = function () {
    $scope.errorMessage = '';

    AuthService.login($scope.username, $scope.password)
    .then(function () {
      $location.path('/');
      $scope.disabled = false;
      $scope.username = $scope.password = '';
    })
    .catch(function () {
      $scope.errorMessage = "Invalid Username and/or Password";
      $scope.disabled = false; 
      $scope.username = $scope.password = '';
    });
  }
}]).controller('logoutController', ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}])