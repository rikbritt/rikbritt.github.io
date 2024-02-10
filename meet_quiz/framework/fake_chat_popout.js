
var gFakeTime = 10;
var gFakeRandomStrings = [
    //"Banana",
    //"Spoon",
    //"Poop",
    "e",
    "p",
    "s"
];
var gFakePlayerNames = [
    "Susan",
    "Rik",
    "Karl",
    "Rushy",
    "Bob",
    "Frank",
    "Rachel",
    "Long Name",
    "Caitlynn Wilde",
    "Vanessa Sosa",
    "Athena Jacobson",
    "Judah McCormack",
    "Alora Manzo",
    "Bethanie Byers",
    "Kaitlynn Crouse",
    "Cooper Ainsworth",
    "Donavon Mount",
    "Armand Muller",
    "Blanca Seay",
    "Campbell Nicholas",
    "Heaven Branch",
    "Estefani Lipscomb",
    "Eugene Amaya",
    "Patrick Curran",
    "Nathaniel Haynes",
    "Lacie Bunn",
    "Berenice Herrera",
    "Truman Worden",
    "Lia Ring",
    "Jazlynn Means",
    "Brandon Decker",
    "Jonatan French",
    "Mckayla Goode",
    "Fletcher Graves",
    "Cynthia Berrios",
    "Shaylee Preciado",
    "Heidi Pearce",
    "Daijah Boles",
    "Brendan Eastman",
    "Neal Ostrander",
    "Justice Kovacs",
    "Alfonso Rudolph",
    "Drew Fortin",
    "Keshon Lackey",
    "Fredrick Champion",
    "Santino Rincon",
    "Ciara Rouse",
    "Cora Lunsford",
    "Rickey Tobin",
    "Diane Payton",
    "Alexis Coble",
    "Maximiliano Schmid",
    "Tariq Rincon",
    "Victoria Wagoner",
    "Fredy Proctor",
    "Dawn Corbett",
    "Jaden Noel",
    "Sofia Hamby"
];
function createElementFromHTML(htmlString) 
{
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}

setInterval(
    function()
    {
        gFakeTime += 1000;
        var chat_window = document.getElementsByClassName("z38b6")[0];
        
        var random_name = gFakePlayerNames[Math.floor(Math.random()*gFakePlayerNames.length)];

        var msg = gFakeRandomStrings[Math.floor(Math.random()*gFakeRandomStrings.length)];
        // if(Math.random() > 0.2)
        // {
        //     if(ChatGame.CurrentRound)
        //     {
        //         if(ChatGame.CurrentRound.WordList && ChatGame.CurrentRound.WordList.length > 0)
        //         {
        //             msg = ChatGame.CurrentRound.WordList[Math.floor(Math.random()*ChatGame.CurrentRound.WordList.length)];
        //         }
        //     }
        // }
        
        if(chat_window.children.length > 0 && Math.random() > 0.5)
        {
            var new_chat = createElementFromHTML(`
            <div class="oIy2qc" data-message-text="${msg}">${msg} @ ${gFakeTime}</div>
            `);
            chat_window.children[chat_window.children.length-1].appendChild(new_chat);
        }
        else
        {
            var new_chat = createElementFromHTML(`
            <div class="GDhqjd" data-sender-name="${random_name}" data-timestamp="${gFakeTime}">${random_name}
                <div class="oIy2qc" data-message-text="${msg}">${msg} @ ${gFakeTime}</div>
            </div>
            `);

            chat_window.appendChild(new_chat);
        }
    },
    500
);