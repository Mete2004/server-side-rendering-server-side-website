// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';


console.log('Hieronder moet je waarschijnlijk nog wat veranderen')
// Doe een fetch naar de data die je nodig hebt
// const apiResponse = await fetch('...')

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
// const apiResponseJSON = await apiResponse.json()

// Controleer eventueel de data in je console
// (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(apiResponseJSON)


async function getStories() {
  const res = await fetch("https://fdnd-agency.directus.app/items/buurtcampuskrant_stories");
  const data = await res.json();
  return data.data;
}

//Haalt alle stories op.

async function getCategories() {
  const res = await fetch("https://fdnd-agency.directus.app/items/buurtcampuskrant_categories");
  const data = await res.json();
  return data.data;
}

//Haalt alle doelgroepen op.

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
   // Render index.liquid uit de Views map
   // Geef hier eventueel data aan mee
   response.render('index.liquid')
})

app.get('/nieuw-west', async function (req, res) {

  const stories = await getStories();
  const categories = await getCategories();

  const filteredStories = stories.filter(function(story) {
    return story.district === "nieuw-west";
  });

  res.render('nieuw-west.liquid', { 
    stories: filteredStories,
    categories: categories 
  });

})

app.get('/zuidoost', async function (req, res) {
  res.render('zuidoost.liquid')
})

app.get('/oost', async function (req, res) {
  res.render('oost.liquid')
})

app.get('/details/:id', async function (req, res) {

  const stories = await getStories();
  const categories = await getCategories();

  const story = stories.find(function(story) {
    return story.id == req.params.id;
  });

  res.render('details.liquid', { 
    story: story,
    categories: categories
  });

});

app.get('/archief', async function (req, res) {
  res.render('archief.liquid')
})

app.get('/algemeen', async function (req, res) {
  res.render('algemeen.liquid')
})

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

app.use((req, res) => {
  res.status(404).render("404.liquid")
})