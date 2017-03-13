'use strict';
angular.module('Cheerleaders.controllers', []).
controller('cheerleadersController', function($scope, $http, $location, $timeout) {
  // Declare a bunch of stuff which needs to be initialized.
  $scope.routine = {};
  $scope.athletePojo = {};
  $scope.currentCounts = [];
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
  // Load the routine data from the server. Populate the hashtag map
  $http.get('api/routines/'+$location.absUrl().split('?',2)[1]).
  success(function (data, status, headers, config) {
    $scope.routine = data.routineObj;
    data.athleteArray.map(function (athlete) {
      $scope.athletePojo[athlete.id] = athlete;
    });
    data.countArray.map(function (count) {
        // ensure that $scope.currentCount is an array of arrays.
        if (!$scope.currentCounts[count.count])
          $scope.currentCounts[count.count] = [];
        $scope.currentCounts[count.count].push(count);
      });
    $scope.currentCounts.map(function (counts) {
      counts.map(function (count) {
        $scope.updateHashtags(count);
      });
    });
    $timeout(makeDraggable);
  });

  $scope.currentCount = 0;
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
    var tempCount = $scope.currentCount;
    while (tempCount >= 0) {
      if (!$scope.currentCounts[tempCount])
        $scope.currentCounts[tempCount] = [];
      var t = $scope.currentCounts[tempCount].find(function (c) { return (c.athleteID == athleteID)});
      if (t)
      {
        return t;
        tempCount = -1;
      }
      tempCount--;
    }
    return;
  }

  /**
   * Prompts the user for the name of a new athlete, then creates an athlete with that name.
   * Adds the athlete to the unused athlete list at count 0
   */
  $scope.addAthlete = function () {
    if (!this.addingAthlete.firstName)
      return;
      // Check to see that there are any counts. If not, that may be an issue
    if (!$scope.currentCounts[0])
      $scope.currentCounts[0] = []

    var posy = Math.max.apply(Math, $scope.currentCounts[0].map(function (c) {return c.posy ? c.posy : 0}).concat([65])) + 15;

    $scope.currentCounts[0].push({
      id : this.createID({prefix : 'C'}), 
      athleteID : this.addingAthlete.id, 
      posx : 1090, 
      posy : posy, 
      note : 'Unused Spot',
      count : 0
    });
    $scope.athletePojo[this.addingAthlete.id] = this.addingAthlete;
    this.addingAthlete = null;
    // Add draggable to the new one. This is overkill, but frankly the client app is fast enough right now.
    $timeout(makeDraggable());
    return;
  }

  /**
   * Removes the given athlete from the local data and marks it to be deleted from the server
   * @param  {[String]} athleteID The ID of the athlete which is to be delted
   */
  $scope.deleteAthlete = function (athleteID) {
    // Delete from local storage
    delete this.athletePojo[athleteID];
    for (var c = 0; c < this.currentCounts.length; c++) {
      if (this.currentCounts[c])
        this.currentCounts[c] = this.currentCounts[c].filter(function (count) {return count.athleteID != athleteID});
    }
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
    window.location.search = '?'+this.newRoutine;
  }

  /**
   * Saves the current routine
   * @return {[boolean]} Returns true if successful
   * COULDDO: Make it have a reasonable return value if save fails
   */
  $scope.save = function () {
    $('#saveButton').prop('disabled', true);
    $http({
      method : 'post',
      url : 'api/save',
      headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
      data : $.param({
        routine : $scope.routine,
        //routine : {routineName : "test", id:"testroutine"},
        athletes : Object.keys($scope.athletePojo).map(function (key) {return $scope.athletePojo[key]}),
        //athletes : [{firstName : "Richard", lastName: "Mack", id : "1"},{firstName : "aaaaaaasdf", lastName: "jkl", id:"2"}],
        counts : $scope.currentCounts.reduce(function (acc, val) {
          return acc.concat(val);
        }, []),
        deletedAthletes : $scope.deletedAthletes
        //counts : [{athleteID:"1",posx:1090,posy:65,count:0, id : "10"},{athleteID:"2",posx:1090,posy:80,count:0, id : "20"}]
      })
    }).success(function (data, status, headers, config) {return true;}).finally(function () {
      $('#saveButton').prop('disabled',false);
      return true;
    });
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
    $('#countNoteInput')[0].value = this.lastKnownCount('note').note; // Need to update the value here, since we only want to update it when changing counts
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
    var noteToUpdate = this.currentCounts[this.currentCount].find(function (c) {return c.athleteID == 'note'})
    if (!noteToUpdate) {
      var newLength = this.currentCounts[this.currentCount].push({
        athleteID : 'note',
        id : 'note' + this.currentCount + this.routine.id,
        routineID : this.routine.id,
        count : this.currentCount,
      });
      noteToUpdate = this.currentCounts[this.currentCount][newLength - 1];
    }
    var targetElement = $($event.target)[0]
    noteToUpdate.note = targetElement.value;
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
      this.jumpToCount(this.currentCount + 1);
      break;
      case 40: // Down Arrow
      this.jumpToCount(this.currentCount - 1);
      break;
      case 39: // Right arrow
      this.jumpToCount(this.currentCount + 8);
      break;
      case 37: // Left arrow
      this.jumpToCount(this.currentCount - 8);
      break;
    }
    return true;
  }

  /**
   * Populates the viewingCountData object with information about the specified count and triggers the viewer to show
   * @param  {[object]} $event The event provided by the browser on click
   */
  $scope.showCount = function ($event) {
    var countObj = this.lastKnownCount($($event.target)[0].id);
    var athleteObj = this.athletePojo[countObj.athleteID];
    // We want to make sure that we aren't passing a reference. Changes should save on closing the window, not on the fly.
    this.viewingCountData = {
      firstName : athleteObj.firstName,
      lastName : athleteObj.lastName,
      athleteID : countObj.athleteID,
      count : countObj.count,
      note : countObj.note
    }
    this.viewingCount = true;
    $scope.$apply();
  }

  /**
   * Saves the viewingCountData which is currently being viewed. Done this way to avoid issues with binding and comments
   * on information loaded from a previous count
   */
  $scope.saveViewingCount = function () {
    var athleteToModify = this.athletePojo[this.viewingCountData.athleteID];
    var oldCountData = this.lastKnownCount(athleteToModify.id);
    console.log(athleteToModify);
    console.log(oldCountData);
    var countToModify = this.currentCounts[this.currentCount].find(function (c) {return c.athleteID == athleteToModify.id})
    if (!countToModify) {
      var newLength = this.currentCounts[this.currentCount].push(oldCountData);
      countToModify = this.currentCounts[this.currentCount][newLength - 1];
    }
    countToModify.count = this.currentCount;
    countToModify.note = this.viewingCountData.note;
    athleteToModify.firstName = this.viewingCountData.firstName;
    athleteToModify.lastName = this.viewingCountData.lastName;
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

    
}).directive('addDraggable', function () {
  return function (scope, element, attrs) {
    if (scope.$last) {
      makeDraggable();
      $("[name~=draggable]").click(function ($event) {
        var $scope = angular.element('#Cheerleaders').scope();
        $scope.showCount($event);});
    } // Despite being in the angular section, this is running with jQuery SHOULDDO: Update to use angular. Figure out angular drag and drop
  }
});