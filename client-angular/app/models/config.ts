export class Config {	
  constructor(configObject : object) {
    for (let property in configObject) {
      for (let value in configObject[property]) {
        try {
          this[property][value] = configObject[property][value];
        }
      }
    }
    console.log(this.numericDisplay)
  };

	numericDisplay : object = {
      enabled : true,
      left : 50,
      top : 750,
      height : 20,
      get width() : number {
      	  return this.height*7.5;
      },
      set width(w : number) : { },
      get resizable() : boolean {
        return true;
      },
      set resizable(r : boolean) : { }
    };

    matDisplay : object = {
    	enabled : true,
    	height : 667,
    	get width() : number {
    		return this.height * 27/20 + 120;
    	},
      set width(w : number) : {},
      get matHeight() : number {
        return this.height;
      },
      set matHeight(m : number) : {},
      get matWidth() : number {
        return this.height * 3/20;
      },
      set matWidth(m : number) : {},
      top : 50,
      left : 50,
      get resizable() : boolean {
        return true;
      },
      set resizable(r : boolean) : {}
    };
      
    tableDisplay : object = {
      enabled : true,
      top : 600,
      left : 700,
      rowHeight : 20,
      get numRows() : number {
        return Math.floor(this.height / this.rowHeight) - 1;
      },
      set numRows(n : number) {}
      width : 330,
      height: 100,
      get cellWidth() : number {
        return (this.width - this.rowHeight)/8
      },
      set cellWidth(c : number) {},
      get resizable() : boolean {
        return true
      },
      set resizable(r : boolean) : { }
    };

    noteDisplay : object = {
      enabled : true,
      top : 720,
      left : 550,
      height : 20,
      width : 300,
      get resizable() : boolean {
        return true;
      },
      set resizable(r : boolean) : { }
    };

    newRoutineButton : object = {
      top : 30,
      left : 50,
      height : 20,
      width : 100,
      get resizable() : boolean {
        return true;
      },
      set resizable(r : boolean) : { }
    };

    countsInput : object = {
      left : 1000,
      top : 750,
      get height() : number {
        return 20;
      },
      set height(h : number) : {},
      get width() : number {
        return 160;
      },
      set width(w : number) {},
      get resizable() : boolean {
        return false;
      },
      set resizable(r : boolean) : { }
    };

    saveButton : object = {
      top : 20,
      left : 1280,
      get height() : number {
        return 20;
      },
      set height(h : number) {},
      get width() : number {
        return 45;
      },
      set width(w : number) {},
      get resizable() : boolean {
        return false;
      },
      set resizable(r : boolean) : { }
    };

    titleDisplay : object = {
      enabled : true,
      top : 0,
      left : "50%",
      width : 200,
      height : 25,
      fontSize : 24,
      get resizable() : boolean {
        return true;
      },
      set resizable(r : boolean) : { }
    };

    logoutButton : object = {
      top : 0,
      left : 0,
      get height() : number {
        return 20;
      },
      set height(h : number) {},
      get width() : number {
        return 55;
      },
      set width(w : number) {},
      get resizable() : boolean {
        return false;
      },
      set resizable(r : boolean) : { }
    };

    spreadsheetDisplay : object = {
      top : 50,
      left : 50,
      height : 200,
      width : 500,
      enabled : true,
      get defaultColumnWidth() : number {
        return 150;
      },
      set defaultColumnWidth(d : number) {},
      get resizable() : boolean {
        return true;
      },
      set resizable(r : boolean) : { }
    }

}