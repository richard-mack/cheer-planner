'use strict';
angular.module('Cheerleaders').
controller('routineController', ['$scope', '$http', '$location', '$timeout', 'AuthService', '$routeParams', '_', function($scope, $http, $location, $timeout, AuthService, $routeParams, _) {
  // Declare a bunch of stuff which needs to be initialized.
  $scope.routine; $scope.athletes; $scope.athletePositions; $scope.currentCountNote; $scope.spreadsheetDisplayAthleteOptions;

  /*
  Stuff that has to be loaded to have access to it.
   */
  $scope.Math = Math;
  $scope._ = _;
  $scope.Object = Object;
  window.s = $scope;
  /*
  Configuration for the app
   */
  $scope.config = {
    numericDisplay : {
      enabled : true,
      left : 50, 
      top : 750, 
      height : 20, 
      get width() {return this.height*7.5},
      get resizable() {return true;}
    },
    matDisplay : {
      enabled : true,
      height : 667,
      get width() {return this.height * 27/20 + 120},
      get matHeight() {return $scope.config.matDisplay.height},
      get matWidth() {return $scope.config.matDisplay.height * 3/20},
      top : 50,
      left : 50,
      get resizable() {return true;},
    },
    tableDisplay : {
      enabled : true,
      top : 600,
      left : 700,
      rowHeight : 20,
      get numRows() {return Math.floor(this.height / this.rowHeight) - 1} ,
      width : 330,
      height: 100,
      get cellWidth() {return (this.width - this.rowHeight)/8},
      get resizable() {return true},
    },
    noteDisplay : {
      enabled : true,
      top : 720,
      left : 550,
      height : 20,
      width : 300,
      get resizable() {return true},
    },
    newRoutineButton : {
      top : 30,
      left : 50,
      height : 20,
      width : 100,
      get resizable() {return true},
    },
    countsInput : {
      left : 1000,
      top : 750,
      get height() {return 20},
      get width() {return 160},
      get resizable() {return false},
    },
    saveButton : {
      top : 20,
      left : 1280,
      get height() {return 20},
      get width() {return 45},
      get resizable() {return false},
    },
    titleDisplay : {
      enabled : true,
      top : 0,
      left : "50%",
      width : 200,
      height : 25,
      fontSize : 24,
      get resizable() {return true},
    },
    logoutButton : {
      top : 0,
      left : 0,
      get height() {return 20},
      get width() {return 55},
      get resizable() {return false}
    },
    spreadsheetDisplay : {
      top : 50,
      left : 50,
      height : 200,
      width : 500,
      enabled : true,
      get defaultColumnWidth() {return 150;},
      get resizable() {return true},
    }

  }

  /*
  Flags
   */
  $scope.flags = {
    isDragging : null,
    isSaving : false,
  }

  /*
  Defaults
   */
  
  $scope.defaultRoutine = {
    counts : [],
    athletes : [],
    notes : [],
    config : {
      spreadsheetDisplayColumns : []
    }
  }
  $scope.spreadsheetDisplayHeaderSettings = {
    smartButtonMaxItems : 36,
    smartButtonTextConverter : function (itemText, originalItem) {
      return originalItem.firstName;
    },
    smartButtonMultiline : true,
    buttonClasses : 'dropdown-button',
    styleActive : true,
  }
  $scope.spreadsheetDisplayHeaderEvents = {
    onClose : function () {
      $scope.computeSpreadsheet();
    }
  }


  $scope.hashtagMapping = {};
  $scope.viewingCount = false;
  $scope.addingAthlete = null;
  $scope.newRoutine = false;
  $scope.viewingCountData = null;
  $scope.isDragging = null;
  $scope.deleteContextMenu = null;
  $scope.isSaving = false;
  $scope.currentCount = 0;

  /*
  Helper functions
   */
  
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

  $scope.isEditable = function (object, property) {
    var d = Object.getOwnPropertyDescriptor(object, property);
    return d.writable;
  }

  $scope.goHome = function () {
    $scope.save();
    $location.path('/');
  }

  $scope.getOffsetCount = function (m,n) { // mth row, nth column
    var desiredCurrentCountRow = Math.ceil($scope.config.tableDisplay.numRows / 2) - 1; // We want the current 8 count to be in this row
    var startOfCurrentEightCount = $scope.currentCount - (($scope.currentCount - 1) % 8);
    if (startOfCurrentEightCount < desiredCurrentCountRow * 8 + 1)
      desiredCurrentCountRow = (startOfCurrentEightCount - 1) / 8;
    // We now have desiredCurrentCountRow somewhere between 0 and halfway down the table
    // startOfCurrentEightCount is the highest number in 1,9,... lower than currentCount
    var firstCountInTable = startOfCurrentEightCount - desiredCurrentCountRow*8;
    return firstCountInTable+8*m+(n-1);


    //var startOffset = startOfCurrentEightCount >= 9 ? startOfCurrentEightCount - 8 : 1;
    //return startOffset+8*m + n;
  }


  $scope.getRoutineData = function () {
    $scope.routine = $scope.hashtagMapping = {};
    $http({
      method : 'GET',
      url : 'api/Routine/'+$routeParams.id
    }).then(function (response) {
      $scope.routine = _.merge($scope.defaultRoutine, response.data.routine);
      $scope.athletes = {};
      response.data.athletes.forEach(function (athlete) {
        $scope.athletes[athlete.id] = athlete;
      });
      $scope.athletePositions = $scope.getAthletePositions();
      $scope.currentCountNote = $scope.getCurrentCountNote();
      $scope.spreadsheetDisplayAthleteOptions = $scope.getSpreadsheetDisplayAthleteOptions();
      $scope.computeSpreadsheet();
      $scope.jumpToCount(1);
    }).catch(function (err)
    {
      console.log(err);
    });
  }

  $scope.getConfigData = function () {
    return $http({
      method : 'GET',
      url : 'api/Account/'
    }).then(function (response) {
      //console.log(data);
      _.merge($scope.config, response.data);
    }).catch(function (err) {
      console.log(err);
    })
  }

  $scope.getRoutineData();
  $scope.getConfigData();

  /**
   * Takes an athlete id and returns the count object with that athlete id 
   * that has the greatest count that is smaller than the current count
   * @param  {[String]} athleteID A string defining an athlete
   * @return {[Count]}     A count object with that athleteID. If done properly,
   *                              returns null only in the case that the athlete does not exist
   */
  $scope.lastKnownCount = function (athleteID) {
    // Early exit if routine not loaded
    if (!$scope.routine || !$scope.routine.counts)
      return;
    var maxCount;
    var tempCount = $scope.currentCount;
    while (tempCount >= 0 && !maxCount) {
      if ($scope.routine.counts[tempCount])
        maxCount = $scope.routine.counts[tempCount][athleteID]
      tempCount--;
    }
    if (!maxCount) // This is a check if none were found. Returns a pretty much blank object
      maxCount = {athleteID : athleteID, count : 0};
    return maxCount;
  }

  $scope.getCurrentCountNote = function () {
    if (!$scope.routine || !$scope.routine.notes)
      return;
    var counter = $scope.currentCount;
    var lastNote;
    while (!lastNote && counter >= 0) {
      lastNote = $scope.routine.notes[counter]
      counter--;
    }
    return lastNote;
  }

  $scope.getAthletePositions = function () {
    // Early exit if routine hasn't loaded yet
    if (!$scope.routine || !$scope.athletes)
      return; 
    var returnArray = [];
    var unusedHeight = 15;
    var unusedCount = 0;
    var athleteList = Object.values($scope.athletes).sort(function (a,b) {return a.firstName > b.firstName});
    // The athlete list is now sorted alphabetically. This is a bit important
    athleteList.forEach(function (athlete) {
      var lastKnown = $scope.lastKnownCount(athlete.id);

      if (lastKnown.count == 0) {
        lastKnown.posx = 1 + 5/($scope.config.matDisplay.matWidth * 9);
        lastKnown.posy = unusedHeight * (unusedCount+1) / $scope.config.matDisplay.matHeight; // The + 1 is for the title of the section
        unusedCount++;
      }

      returnArray.push({athlete : athlete, count : lastKnown});
    });
    return returnArray;
  }

  $scope.getSpreadsheetDisplayAthleteOptions = function () {
    return _.map($scope.athletes, function (athlete) {return {id : athlete.id, label : athlete.name, firstName : athlete.firstName}});
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
      $scope.routine.counts[0] = {};

    $scope.routine.counts[0][this.addingAthlete.id] = {
      athleteID : this.addingAthlete.id, 
      count : 0
    };
    $scope.athletes[this.addingAthlete.id] = {
      firstName : this.addingAthlete.firstName,
      lastName : this.addingAthlete.lastName,
      name : this.addingAthlete.firstName + ' ' + this.addingAthlete.lastName,
      id : this.addingAthlete.id,
      skills : this.addingAthlete.skills,
      position : this.addingAthlete.position
    };
    this.addingAthlete = null;
    $scope.athletePositions = $scope.getAthletePositions();
    $scope.spreadsheetDisplayAthleteOptions = $scope.getSpreadsheetDisplayAthleteOptions();
    return;
  }


  /**
   * Removes the given athlete from the local data and marks it to be deleted from the server
   * @param  {[String]} athleteID The ID of the athlete which is to be delted
   */
  $scope.deleteAthlete = function (athleteID) {
    // Delete from local storage
    delete $scope.athletes[athleteID];
    $scope.routine.counts.forEach(function (count) {count ? delete count[athleteID] : null});

    $scope.athletePositions = $scope.athletePositions.filter(function (pos) {return pos.athlete.id != athleteID});
    $scope.spreadsheetDisplayAthleteOptions = $scope.spreadsheetDisplayAthleteOptions.filter(function (athlete) {return athlete.id != athleteID});
    // Get rid of the context menu if it is hanging around
    $scope.deleteContextMenu = null;
  }

  /**
   * Prompts the user for a name for a new routine, then saves the current routine and navigates to a new one
   */
  $scope.addRoutine = function () {
    if (!this.newRoutine)
      return;
    $scope.save(); // Save the one you are at right now
    return $http({
      method : 'POST',
      url : 'api/Routine/',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {data : {name : $scope.newRoutine, id : $scope.createID({prefix : 'R'})}}
    }).then(function (result) {
      console.log(result);
      $location.path('/routine/'+result[0].id);
      //$scope.getRoutineData();
      //$scope.newRoutine = '';
      return true;
    }).catch(function (err) {console.log(err)})
  }

  /**
   * Saves the current routine
   * @return {[boolean]} Returns true if successful
   * COULDDO: Make it have a reasonable return value if save fails
   */
  $scope.save = function () {
    $scope.isSaving = true;
    // We need to make sure our data is all in the right format.
    Object.values($scope.athletes).forEach(function (athlete) {
      athlete.name = athlete.firstName + ' ' + athlete.lastName;
      if (!athlete.id)
        athlete.id = $scope.createID({prefix : 'A'});
      delete athlete._id; // Mongo internal field
      delete athlete.__v; // Mongo internal field
    });
    $scope.routine.athletes = Object.keys($scope.athletes);
    delete $scope.routine._id;
    delete $scope.routine.__v;

    return Promise.all([
        $http({
      method : 'POST',
      url : 'api/Athlete/',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {data : Object.values($scope.athletes)},
    }).then(function (data, status, headers, config) {return true;}),
        $http({
          method: 'POST',
          url : 'api/Routine/',
          headers : {
            'Content-Type' : 'application/json'
          },
          data : {data : $scope.routine},
        }).then(function (data) {$scope.isSaving = false; return true;})
    ]);
  }

  $scope.saveConfig = function () {
    return $http({
      method : 'POST',
      url : 'api/Account/',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {config : $scope.config}
    }).then(function(data) {console.log(data)}).catch(function (err) {console.log(err);})
  }

  $scope.startDragging = function () {
    $scope.isDragging = {left : 0, top : 0};
    $scope.$apply();
  }


  $scope.stopDragging = function ($event, $ui) {
    var id = $ui.helper[0].id;
    $scope.isDragging = null;
    var rawPosition = {left : $event.target.offsetLeft, top : $event.target.offsetTop};
    var matPosition = {
      left : (rawPosition.left - $scope.config.matDisplay.left) / ($scope.config.matDisplay.matWidth * 9),
      top : (rawPosition.top - $scope.config.matDisplay.top) / $scope.config.matDisplay.matHeight
    }

    // First, check if it is a valid place to put the item.
    if (!($scope.currentCount == 0 ||
      matPosition.left < 0 ||
      matPosition.left > 1 ||
      matPosition.top < 0 || 
      matPosition.top > 1)) {


      var lastKnownCountForId = $scope.lastKnownCount(id);
    if (lastKnownCountForId.count != $scope.currentCount) {
      $scope.routine.counts[$scope.currentCount][id] = {
        count : $scope.currentCount,
        athleteID : id,
        note : '',
        posx : matPosition.left,
        posy : matPosition.top
      };
    }
    else {
      lastKnownCountForId.posx = matPosition.left;
      lastKnownCountForId.posy = matPosition.top;
    }
  }
  $scope.$apply();
  return;
}

$scope.stopConfigDragging = function ($event, $ui) {
  var id = $event.target.id;
  $scope.config[id].left = $event.target.offsetLeft;
  $scope.config[id].top = $event.target.offsetTop;
}

$scope.resizeConfigDragging = function ($event, $ui) {
  var id = $event.target.id;
  $scope.config[id].height = $event.target.offsetTop + 5;// - $scope.config[id].top + 5;
  try {
    $scope.config[id].width = $event.target.offsetLeft + 5
  } catch (err) {};
  $event.target.style.left = $scope.config[id].width - 5;
  $scope.$apply();
}

$scope.restoreDragHandle = function ($event, $ui) {
  var id = $event.target.id;
  $event.target.style.left = $scope.config[id].width-5;;
}

  $scope.onDrag = function ($event, $ui) {
    $scope.isDragging.left = $event.target.offsetLeft + ($event.target.offsetWidth / 2);
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
        if (parsedCount < 1)
          parsedCount = 1;
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
    if (!$scope.routine.counts[count])
      $scope.routine.counts[count] = {}; // If the count doesn't exist yet, create it
    $scope.athletePositions = $scope.getAthletePositions();
    $scope.currentCountNote = $scope.getCurrentCountNote(); // Need to update the value here, since we only want to update it when changing counts
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
      //console.log(charCode);
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
    console.log($event);
    $scope.routine.notes[$scope.currentCount] = $event.target.value;
    // Update hashtags
    // Delete all hashtags on this count
    var hashtagsToDelete = Object.keys(this.hashtagMapping).filter(function (key) {return $scope.hashtagMapping[key] == $scope.currentCount});
    //console.log(hashtagsToDelete);
    hashtagsToDelete.forEach(function (tag) {delete $scope.hashtagMapping[tag];});
    this.updateHashtags($event.target.value);
    return true;
  }

   $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });
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

  $scope.listenClick = function ($event) {
    $scope.deleteContextMenu = null;
    //console.log($event);
    return;
  }

  $scope.handleCountMouseclick = function ($event) {
    switch ($event.button) {
      case 0:
        $scope.showCount($event.target.id, $scope.currentCount);
        break;
      case 2:
        $scope.deleteContextMenu = {};
        $scope.deleteContextMenu.left = $event.pageX;
        $scope.deleteContextMenu.top = $event.pageY;
        $scope.deleteContextMenu.athleteID = $event.target.id;
        break;
    }
  }

  $scope.handleSpreadsheetClick = function (athleteID, countNumber) {
    $scope.jumpToCount(countNumber);
    return; // For now, do just this until I figure out what should happen here
    if (!athleteID)
      return;
    $scope.showCount(athleteID, countNumber);
  }
  /**
   * Populates the viewingCountData object with information about the specified count and triggers the viewer to show
   * @param  {[object]} $event The event provided by the browser on click
   */
  $scope.showCount = function (athleteID, count) {
    if ($scope.isDragging)
      return;
    //console.log($event);
    $scope.jumpToCount(count);
    var countObj = $scope.lastKnownCount(athleteID);
    var athleteObj = $scope.athletes[athleteID]
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
    var athlete = $scope.athletes[$scope.viewingCountData.athleteID];
    var oldCountData = $scope.lastKnownCount(athlete.id);

    var countToModify = $scope.routine.counts[$scope.currentCount][athlete.id];
    if (!countToModify) {
      countToModify = $scope.routine.counts[$scope.currentCount][athlete.id] = _.clone(oldCountData);
    }
    countToModify.count = $scope.currentCount;
    countToModify.note = $scope.viewingCountData.note;
    athlete.firstName = $scope.viewingCountData.firstName;
    athlete.lastName = $scope.viewingCountData.lastName;
    athlete.name = athlete.firstName + ' ' + athlete.lastName;
    this.viewingCountData = null;
    this.viewingCount = false;
    $scope.computeSpreadsheet({counts : [$scope.currentCount]});
  }

  /**
   * Updates the hashtag map that goes to a specific count
   * @param  {[type]} count [description]
   * @return {[type]}       [description]
   */
  $scope.updateHashtags = function (note) {
    var tags = note.split('#').slice(1).map(function (t) {return t.trim()});
    for (var i = 0; i < tags.length; i++) {
      if (!this.hashtagMapping.hasOwnProperty(tags[i]))
        this.hashtagMapping[tags[i]] = $scope.currentCount;
      else
        throw new Error('Duplicate tags on counts ' + $scope.currentCount + ' and ' + this.hashtagMapping[tags[i]]);
    }
  }

  $scope.computeSpreadsheet = function (options) {
    // options.counts is an array of counts
    // options.athleteIDs is an array of athleteIDs
    var countsToCompute = _.range(1,$scope.routine.counts.length);
    var columnsToCompute = _.range(0,$scope.routine.config.spreadsheetDisplayColumns.length);

    if (options && options.counts)
      countsToCompute = options.counts;
    if (options && options.athleteIDs) {
      rawColumnsToCompute = $scope.routine.config.spreadsheetDisplayColumns.map(function (column) {
        return _.intersection(_.map(column, 'id'), options.athleteIDs).length
      });
      columnsToCompute = _(rawColumnsToCompute).map(function (val, index) {return index}).compact().valueOf()
    }

    if (!$scope.spreadsheetDisplay)
      $scope.spreadsheetDisplay = [];

    countsToCompute.forEach(function (count) {
      if (!$scope.spreadsheetDisplay[count])
        $scope.spreadsheetDisplay[count] = [];
      columnsToCompute.forEach(function (columnIndex) {
        $scope.spreadsheetDisplay[count][columnIndex] = _($scope.routine.config.spreadsheetDisplayColumns[columnIndex].athlete)
        .map(function (athlete) {
          var countObj = $scope.routine.counts[count];
          return countObj && countObj[athlete.id] ? countObj[athlete.id].note : '';
        })
        .uniq().compact().join(', ').valueOf();
      });
    });
  }

  $scope.updateNotes = function (countNumber, index) {
    var athletesToUpdate = $scope.routine.config.spreadsheetDisplayColumns[index].athlete.map(function (obj) {return obj.id});
    athletesToUpdate.forEach(function (athleteID) {
      var countToModify = $scope.routine.counts[countNumber][athleteID];
      if (!countToModify) {
        var oldCountData = $scope.lastKnownCount(athleteID);
        countToModify = $scope.routine.counts[countNumber][athleteID] = _.clone(oldCountData); // Copy position and stuff from previous count
        countToModify.count = $scope.currentCount;
      }
      countToModify.note = $scope.spreadsheetDisplay[countNumber][index];
    });
    $scope.computeSpreadsheet({athletes : athletesToUpdate});
  }

  // SHOULDDO: Improve error handling so users can see the errors
  // SHOULDDO: Allow renaming of routines

    
}]).controller('routineIndexController', ['$scope', '$location', '$http', 'AuthService', function ($scope, $location, $http, AuthService) {
  $scope.routines = [];
  $scope.newRoutine = '';
  // SHOULDDO: Allow renaming of routines
  // SHOULDDO: Allow deletion of routines
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

  $scope.addRoutine = function () {
    if (!this.newRoutine)
      return;
    return $http({
      method : 'POST',
      url : 'api/Routine/',
      headers : {
        'Content-Type' : 'application/json'
      },
      data : {data : {name : $scope.newRoutine, id : $scope.createID({prefix : 'R'})}}
    }).then(function (result) {
      $location.path('/routine/'+result[0].id);
      return true;
    }).catch(function (err) {console.log(err)})
  }

  $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });
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
          //console.log('success');
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
    .then(function (result) {
      $location.path('/');
      $scope.disabled = false;
      $scope.username = $scope.password = '';
    })
    .catch(function (err) {
      $scope.errorMessage = "Invalid Username and/or Password";
      console.log(err);
      $scope.disabled = false; 
      $scope.username = $scope.password = '';
    });
  }
}]).constant('_', window._);