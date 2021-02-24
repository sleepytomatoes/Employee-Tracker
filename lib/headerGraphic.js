const colors = require('colors/safe'); // adds color to tables
const Table = require('cli-table'); // formats tables in a visually pleasing way
const { clear } = require('console'); // clears console for a cleaner user experience
const figlet = require('figlet'); // npm library renders text to graphic

function headerGraphic() {
    clear();

    var table = new Table;({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
        , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
        , 'left': '║' , 'left-mid': '║' , 'mid': ' ' , 'mid-mid': ''
        , 'right': '║' , 'right-mid': '║' , 'middle': '' }
    });

    let firstWord = colors.brightMagenta.bold(
        figlet.textSync('Employee', { horizontalLayout: 'fitted' , font: 'Standard' })
    );

    let secondWord = colors.brightMagenta.bold(
        figlet.textSync('Tracker', { horizontalLayout: 'fitted' , font: 'Standard' })
    );

    table.push(
        [firstWord]
      , [secondWord]
    );
  
    let finalTable = table.toString();
     
    console.log(finalTable);
    
}

module.exports = headerGraphic;