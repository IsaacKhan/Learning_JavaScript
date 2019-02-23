// Messing with the DOM here, which basically means
// we are adjusting the html via our script
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.src = 'logo.png';

const container = document.createElement('div');
container.setAttribute('class', 'container');

// This adds all the stuff we adjusted above to our main page
app.appendChild(logo);
app.append(container);

// Creating a variable to store our request
// We are also assigning a new XMLHttpRequest object to this variable
// XMLHttpRequest is an object used to request data from a web server
var request = new XMLHttpRequest();

// Now we are opening a connection to the URL endpoint using this variable
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);

request.onload = function () {
    // Begin accessing JSON data here

    // So this little chunk of code will parse the JSON file
    // and then store it in the array "data", but to make it an array
    // we need to use the forEach function.
    var data = JSON.parse(this.response);

    /// Adding in an if statement for http error codes
    if (request.status >= 200 && request.status < 400)
    {
        data.forEach(movie => 
        {
            // Create a div with a card class
            const card = document.createElement('div');
            card.setAttribute('class','card');

            // Create a header and set the txt content to the film title
            const h1 = document.createElement('h1');
            h1.textContent = movie.title;

            // Do the same for the film description, but use a paragraph
            const p = document.createElement('p');
            // Limiting to 300 chars
            movie.description = movie.description.substring(0,300);
            p.textContent = `${movie.description}...`;

            // Now we append everything to the conatiner on the main page
            container.appendChild(card);
            card.appendChild(h1);
            card.appendChild(p);
        });
    }
    else
    {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Who broke my perfect code?!`;
        app.appendChild(errorMessage);
        }
}

// Send Request
request.send();