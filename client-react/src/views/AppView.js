import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

function AppView(props) {

  return (
    <div>
      <Header {...props} />
      {/*<ModalMask {...props} />*/}
      <LoginView {...props} />
      <AthleteDetailsView {...props} />
      <CountDetailsView {...props} />
      <FloorView {...props} />
      <SpreadsheetView {...props} />
      <Footer {...props} />
    </div>
  );
}

function LoginView(props) {
  let username = props.user.getIn(['loginDetails', 'username']);
  let password = props.user.getIn(['loginDetails', 'password']);
  return (
    <section id="login-view" style={{display : props.appState.get('activeView') == 'login' ? 'initial' : 'none'}}>
      Username: 
      <input id="username" 
        value={username}
        onChange={
          (e) => props.onChangeLoginDetails('username', e.target.value)
        }
        /><br /> 
      Password: 
      <input id="password" 
        value={password}
        onChange={
          (e) => props.onChangeLoginDetails('password', e.target.value)
        }
      />
      <button onClick={
        () => props.login(username, password)
      }>Login</button>
    </section>
    )
}

function Header(props) {
  return (
  <header id="header" style={{display : props.appState.get('activeView') != 'login' ? 'flex' : 'none'}}>
    <button id="floor-button" className="header-button" 
      style={{
        'backgroundColor' : props.appState.get('activeView') == 'floor' ? 'green' : 'lightgrey',
        'color' : props.appState.get('activeView') == 'floor' ? 'white' : 'black'
      }}
      onClick={
        () => props.setActiveView('floor')
      }>Floor View</button>
    <button id="spreadsheet-button" className="header-button" 
      style={{
        'backgroundColor' : props.appState.get('activeView') == 'spreadsheet' ? 'green' : 'lightgrey',
        'color' : props.appState.get('activeView') == 'spreadsheet' ? 'white' : 'black'

      }}
      onClick={
        () => props.setActiveView('spreadsheet')
      }>Spreadsheet View</button>
  </header>)
}

function ModalMask(props) {
  return (
    <section id="modal-mask" style={{display : props.appState.get('isModalVisible') ? 'initial' : 'none'}}>
    </section>
  )
}
function FloorView(props) {
  if (props.athletes.size == 0) {
    console.log('no athletes');
  }
  // Get the Immutable.Map representing the current count
  let currentCountPositions = props.appState.getIn(['routinePositions',props.appState.get('currentCount')], []);
  // If we got something from the getIn, we want to make sure we're not trying to put the note on the floor
  if (currentCountPositions.constructor.name != 'Array') {
    currentCountPositions = currentCountPositions.delete('note');
  }
  // HACK: SHOULDDO: Do this right
  return (
    <section id="floor-view" style={{display : props.appState.get('activeView') == 'floor' ? 'initial' : 'none'}}>
      <div id="floor-display" style={{position : 'relative', left : '200px'}}>
        <CreateFloor {...props} />
        <div id="unused-athletes-list">
          <b>Unused Athletes</b>
        </div>
        <div id="athletes-on-floor">
          {
            currentCountPositions.map((athleteObj, athleteId) => {
              return (<div
                className="floor-athlete"
                key={'athleteonfloor'+athleteId}
                style={{position : 'absolute', 
                        left : 900*athleteObj.get('posx')+ 'px',
                        top : 667*athleteObj.get('posy')+'px'}}
                onClick={
                  () => props.onClickOpenCountDetails(athleteId, props.appState.get('currentCount'))
                }
              >{athleteObj.get('shortName')}</div>)
            })
            }
          </div>
          <input id="count-comment"
            value={props.appState.getIn(['routinePositions', props.appState.get('currentCount'), 'note'], 'No Comment')}
            onChange={
              (e) => props.upsertNote(props.appState.get('currentCount'), e.target.value)
            }
            />
      </div>
      <CountsInput  {...props} /> 
    </section>
    
    )
}

function CreateFloor(props) {
  return (<section id="floor">
      {[0,1,2,3,4,5,6,7,8].map(i => (
            // To get the rightmost mat having the correct border, we eed to override the CSS here
            <div key={'floormat' + i} className="floor-mat" style={{ 'left' : 100*i + 'px', 'borderRight' : i == 8 ? '1px black solid' : '0px'}}>
            </div>
            ))}
    </section>
    )
}

function CountsInput(props) {
  let currentCount = props.appState.get('currentCount');
  return (
    <section id="count-input"> 
      <div style={{position : 'relative', top : '1em', width : '200px', 'textAlign' : 'center', 'fontWeight' : 800, 'fontSize' : '24pt'}}>
          {Math.floor((currentCount - 1) / 8) + 1} : {currentCount % 8 || 8}
          <button className="count-input up-button"
            style={{position : 'relative', left : '-3.4ch', top : '-1em'}}
            onClick={() => props.setCurrentCount(currentCount + 8)}>^</button>
          <button className="count-input down-button"
            style={{position : 'relative', left : '-4.4ch', top : '1em'}}
            onClick={() => props.setCurrentCount(currentCount - 8)}>v</button>
          <button className="count-input up-button"
            style={{position : 'relative', left : '-3ch', top : '-1em'}}
            onClick={() => props.setCurrentCount(currentCount + 1)}>^</button>
          <button className="count-input down-button"
            style={{position : 'relative', left : '-4ch', top : '1em'}}
            onClick={() => props.setCurrentCount(currentCount - 1)}>v</button>
        </div>

        <div style={{position: 'relative', top : '60px', left : '10px'}}>
          Jump to Count: 
          <input
            style={{width : '3em'}}
            type="number"
            max="800"
            min="1"
            value="0"
            onChange={
              (event) => {
                props.setCurrentCount(event.target.value)
              }
            }
          />
        </div>
      </section>
    )
}

function SpreadsheetView(props) {
  let isSpreadsheetActive = props.appState.get('activeView') == 'spreadsheet';
  if (isSpreadsheetActive) {
    return (
      <section id="spreadsheet-view">
        <table>
          <thead>
            <tr className="spreadsheet-first-row">
              <td id="corner-cell"></td>
              {props.athletes.get('athletesList').valueSeq().map( (athlete) => {
                // Create the headers for the table. For now, one for each athlete
                // COULDDO: Figure out how to make the scrolling work out nicer.
                if (props.appState.get('hiddenAthletes').has(athlete.id))
                  return;
                return (
                  <th key={'spreadsheetHeader'+athlete.id} className="spreadsheet-column-header" style={{position: 'initial'}}> 
                    {athlete.name}
                    <button
                      onClick={() => props.hideAthlete(athlete.id)}
                      >(-)</button>
                  </th>
                )
              })}
              <th style={{width : '14em'}}>
                <Select 
                  name="test-select" 
                  options={props.appState.get('hiddenAthletes').valueSeq().map(a => {return {label : props.athletes.getIn(['athletesList',a,'name'], 'Unknown Athlete'), value : a}}).toArray()} 
                  onChange={(val) => props.showAthlete(val.value)}
                  clearable={false}
                  searchable={true}
                  placeholder="Show Hidden Athletes"
                  noResultsText="All Athletes Shown"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {props.routine.get('counts').map( (count,index) => {
              if (index == 0)
                return;
              return (
                <tr key={'spreadsheetCount'+index} className={"spreadsheet-row spreadsheet-row-" + (index % 2 ? "odd" : "even")}>
                  <th className="spreadsheet-row-header">{(index - 1) % 8 == 0 ? `${(index - 1) / 8 + 1} : 1` : `${index % 8 || 8}`}</th>
                  {props.athletes.get('athletesList').valueSeq().map( (athlete) => {
                    if (props.appState.get('hiddenAthletes').has(athlete.id))
                      return;

                    let athleteCount = count.get(athlete.id);
                    return (
                      <td key={athlete.id + 'spreadsheetCount'+index} className="spreadsheet-note-cell">
                        <input 
                          value={athleteCount ? athleteCount.note : null} 
                          onChange={
                            (e) => props.upsertNote(props.appState.get('currentCount'), e.target.value)
                          }
                          disabled={true}
                        />
                      </td>
                      )
                  })
                }
                </tr>
                )
            })
        }
        </tbody>
        </table>
      </section>
      )
  }
  return (<div id="spreadsheet-not-active"></div>)
}

function AthleteDetailsView(props) {
  return (
    <div id="athlete-details-section" className="modal"
        style={{display : props.appState.get('editingAthlete') ? 'block' : 'none'}}
        >
        <label 
          id="athlete-details-id"
        >
          {
            props.appState.get('editingAthlete') ?
              props.athletes.getIn(['athletesList', props.appState.get('editingAthlete')]).id
              : ''
          }
        </label>
        <input 
          id="athlete-details-name" 
          value={
            props.appState.get('editingAthlete') ?
              props.athletes.getIn(['athletesList', props.appState.get('editingAthlete')]).name
              : ''
          }
          onChange={
            (e) => props.onChangeAthleteDetails(props.appState.get('editingAthlete'), 'name', e.target.value)
          }
        />
        <input
          id="athlete-details-shortname"
          value={
              props.athletes.getIn(['athletesList', props.appState.get('editingAthlete'), 'shortName'], '')
            }
          onChange={
            (e) => props.onChangeAthleteDetails(props.appState.get('editingAthlete'), 'shortName', e.target.value)
          }
        />
        <button
          type="button"
          onClick={
            () => props.onClickCloseAthleteDetails()
          }
          >
            Close
          </button>
      </div>)
}

function CountDetailsView(props) {
  let editingCount = props.appState.get('editingCount');
  let editingCountPositions = props.appState.getIn(['routinePositions', editingCount.countNumber, editingCount.athleteId]);
  let athlete = props.athletes.getIn(['athletesList', editingCount.athleteId])
  return (
    <div id="count-details-section" className="modal"
      style={{display : editingCount.countNumber ? 'block' : 'none'}}>
      <label id="count-details-athleteId">
        { athlete.name }
      </label>
      X Position: 
      <input
        id="count-details-posx"
        type="number"
        value={
          props.appState.getIn(['routinePositions', editingCount.countNumber, editingCount.athleteId, 'posx'], '')
        }
        onChange={
          (e) => {
            props.onChangeCountDetails({
              count : editingCount.countNumber,
              athleteId : editingCount.athleteId,
              posx : Number(e.target.value), 
              // posy doesn't change, but we may not have a set posy for this count yet
              // So, we take the one from routinePositions
              posy : editingCountPositions.get('posy'),
              // Don't change the note.
              note : props.routine.getIn(['counts', editingCount.countNumber, editingCount.athleteId], {note : ''}).note
            });
          }
        }
      />
      Y Position:
      <input
        id="count-details-posy"
        type="number"
        value={
          props.appState.getIn(['routinePositions', editingCount.countNumber, editingCount.athleteId, 'posy'] : '')
        }
        onChange={
          (e) => {
            let editingCountDetails = props.routinePositions[editingCount.countNumber][editingCount.athleteId];
            props.onChangeCountDetails({
              count : editingCount.countNumber,
              athleteId : editingCount.athleteId,
              // posx doesn't change, but we may not have a set posx for this count yet
              // So, we take the one from routinePositions
              posx : editingCountPositions.get('posx'), 
              posy : Number(e.target.value),
              // Don't change the note.
              note : props.routine.getIn(['counts', editingCount.countNumber, editingCount.athleteId], {note : ''}).note,
            });
        }
      }
      />
      <input
        id="count-details-note"
        value={
          // This is different from the previous one since notes are specific to one count
          props.routine.getIn(['counts', editingCount.countNumber, editingCount.athleteId], {note : ''}).note
        }
        onChange={
          (e) => {
            props.onChangeCountDetails({
              count : editingCount.countNumber,
              athleteId : editingCount.athleteId,
              // Positions may not be defined for this count yet
              // So, we take the ones from routinePositions
              posx : editingCountPositions.get('posx'),
              posy : editingCountPositions.get('posy'),
              // Don't change the note.
              note : e.target.value,
            });
          }
        }
      />
      <button type="button"
        onClick={
          () => props.onClickCloseCountDetails()
        }>
          Close
        </button>
    </div>)
}

function Footer(props) {
  return (
    <footer id="footer" style={{display : props.appState.get('activeView') != 'login' ? 'flex' : 'none'}}>
      <button id="save-athlete" className="footer-button"
        onClick={
          () => {
            props.athletes.get('athletesList').forEach(
              (athlete) => {
                props.saveAthlete(athlete);
              });
          }
        }>Save Athletes</button>
      <button id="save-routine" className="footer-button"
        onClick={
          () => props.saveRoutine(props.routine)
        }>Save Routine</button>
      <button id="logout-button" className="footer-button"
        >Logout</button>
    </footer>
  )
}

export default AppView;