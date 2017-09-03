import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

function AppView(props) {

  return (
    <div>
      <Header {...props} />
      <FloorView {...props} />
      <SpreadsheetView {...props} />
    </div>
  );
}

function Header(props) {
  return (
  <header id="header">
    <button id="floor-button" onClick={() => props.setActiveView('floor')}>Floor View</button>
    <button id="spreadsheet-button" onClick={() => props.setActiveView('spreadsheet')}>Spreadsheet View</button>
    <button id="logout-button">Logout</button>
  </header>)
}

function FloorView(props) {
  if (props.athletes.size == 0) {
    console.log('no athletes');
  }
  return (
    <section id="floor-view" style={{display : props.appState.get('activeView') == 'floor' ? 'initial' : 'none'}}>
      <div id="athlete-details-section"
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
            props.appState.get('editingAthlete') ? 
              props.athletes.getIn(['athletesList', props.appState.get('editingAthlete')]).shortName
              : ''
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
      </div>
      <div id="floor-display" style={{position : 'relative', left : '200px'}}>
        <div id="floor">
          {[0,1,2,3,4,5,6,7,8].map(i => (
            // To get the rightmost mat having the correct border, we eed to override the CSS here
            // SHOULDDO: Change this to a table so I can use border-collapse. The floor is basically a table anyway
            <div key={'floormat' + i} className="floor-mat" style={{ 'left' : 100*i + 'px', 'borderRight' : i == 8 ? '1px black solid' : '0px'}}>
            </div>
            ))}
        </div>
        <div id="unused-athletes-list">
          <b>Unused Athletes</b>
        </div>
        <div id="athletes-on-floor">
          {props.routinePositions[props.appState.get('currentCount')] ? 
            Object.keys(props.routinePositions[props.appState.get('currentCount')]).map(athleteId => {
              let athleteObj = props.routinePositions[props.appState.get('currentCount')][athleteId];
              return (<div
                key={'athleteonfloor'+athleteId}
                style={{position : 'absolute', 
                        left : 900*athleteObj.posx+ 'px',
                        top : 667*athleteObj.posy+'px'}}
                onClick={
                  () => props.onClickAthlete(athleteId)
                }
              >{athleteObj.shortName}</div>)
            }) 
            : ''}
          </div>
          <div id="count-comment">
            {props.countNotes[props.appState.get('currentCount')] || 'No Comment'}  
          </div>
      </div>
      <div id="count-input">
        <input
          type="number"
          onChange={
            (event) => {
              props.setCurrentCount(event.target.value)
            }
          }
        />
      </div>
      <div id="count-input">
        {Math.floor((props.appState.get('currentCount') - 1) / 8) + 1} : {props.appState.get('currentCount') % 8 || 8}
        <button className="count-input up-button"
          style={{position : 'relative', left : '-3.4ch', top : '-1em'}}
          onClick={() => props.setCurrentCount(props.appState.get('currentCount') + 8)}>^</button>
        <button className="count-input down-button"
          style={{position : 'relative', left : '-4.4ch', top : '1em'}}
          onClick={() => props.setCurrentCount(props.appState.get('currentCount') - 8)}>v</button>
        <button className="count-input up-button"
          style={{position : 'relative', left : '-3ch', top : '-1em'}}
          onClick={() => props.setCurrentCount(props.appState.get('currentCount') + 1)}>^</button>
        <button className="count-input down-button"
          style={{position : 'relative', left : '-4ch', top : '1em'}}
          onClick={() => props.setCurrentCount(props.appState.get('currentCount') - 1)}>v</button>
      </div>
      
    </section>
    
    )
}

function SpreadsheetView(props) {
  return (
    <section id="spreadsheet-view" style={{display : props.appState.get('activeView') == 'spreadsheet' ? 'initial' : 'none'}}>
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
                options={props.appState.get('hiddenAthletes').valueSeq().map(a => {return {label : a, value : a}}).toArray()} 
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
              <tr key={'spreadsheetCount'+index} className="spreadsheet-row">
                <th className="spreadsheet-row-header">{(index - 1) % 8 == 0 ? `${(index - 1) / 8 + 1} : 1` : `${index % 8 || 8}`}</th>
                {props.athletes.get('athletesList').valueSeq().map( (athlete) => {
                  if (props.appState.get('hiddenAthletes').has(athlete.id))
                    return;

                  let athleteCount = count.get(athlete.id);
                  return (
                    <td key={athlete.id + 'spreadsheetCount'+index}>{athleteCount ? athleteCount.note : null}</td>
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

/*function Header(props) {
  return (
    <header id="header">
      <h1>todos</h1>
      <NewTodo {...props} />
    </header>
  );
}

function Main(props) {
  if (props.todos.size === 0) {
    return null;
  }
  return (
    <section id="main">
      <ul id="todo-list">
        {[...props.todos.values()].reverse().map(todo => (
          <li key={todo.id}>
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                checked={todo.complete}
                onChange={
                  () => props.onToggleTodo(todo.id)
                }
              />
              <label>{todo.text}</label>
              <button
                className="destroy"
                onClick={
                  () => props.onDeleteTodo(todo.id)
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer(props) {
  if (props.todos.size === 0) {
    return null;
  }

  const remaining = props.todos.filter(todo => !todo.complete).size;
  const phrase = remaining === 1 ? ' item left' : ' items left';

  return (
    <footer id="footer">
      <span id="todo-count">
        <strong>
          {remaining}
        </strong>
        {phrase}
      </span>
    </footer>
  );
}
*/
export default AppView;