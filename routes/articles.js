const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get('/new', (req, res)=>{
    res.render("articles/new", { article: new Article() })
})

router.get('/:slug', async (req, res) =>{
        const article = await Article.findOne({slug: req.params.slug})
        if (article == null) {
            res.redirect('/')
        } else {
        res.render('articles/show', {article: article})    
        }
})

// Lorsqu'on va cliquer sur le "save" button du formulaire l'URL va devenir .../acticles/ ce qui va appeller cette fonction POST.
// .get et .post sont des méthodes http. .get permet de récupérer du contenu depuis un serveur et .post permet d'envoyer du contenu vers un serveur. 
router.post('/', async (req, res) =>{
    //Ici on crée un formulaire vide qu'on assigne à la variable article
    //Ce formulaire est crée selon le modèle défini au sein du doc /model/article
    //En gros on structure notre variable pour y déposer des données
    let article = new Article({
        //Une fois le formulaire vierge crée on le rempli avec les données POSTées lors de l'envoi du questionnaire.
        //On récupére alors les données du formulaire de la page HTML
        //Pour que le serveur soit capable de récupérer ces données il faut ajouter à server.js :
        //  app.use(express.urlencoded({ extended : false}))
        //Ce middleware (fonction éxécutée entre la réception d'une requete et l'envoi d'une réponse par le serveur.) est un "body parser" (analyseur de body). 
        //qui permet au serveur de lire et récupérer le contenu HTML d'une page.
        title: req.body.title,
        //La ligne ci dessus peut être lue comme ça:
        //Le titre de l'objet artcile nouvellement crée est égal à l'élément "title" du corps (body) de la requete (formulaire soumis)
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
       //Une fois le formulaire rempli on le sauvegarde avec la méthode mongoose .save()
       //La sauvegarde peut prendre du temps, il s'agit donc d'une fonction asynchrone.
       //On attend donc que la savegarde soit réalisée pour rediriger l'utilisateur vers la page "succès"
       //Pour finir on update l'objet "article" avec l'article sauvegardé
       article = await article.save()
       //${blahblah} est un "string interpolation" et cela fonction globalement comme une concatenation
       //Attention pour ces string il faut utiliser les bat  
       res.redirect(`/articles/${article.slug}`)
    } catch (e) {
       //Si la méthode .save() rencontre une erreur, on l'attrape avec un try/catch et on envoi vers la page "echec"
       console.log(e)
       res.render('articles/new', {article : article})
    }  
})

router.delete('/:id', async (req, res) =>{
    await Article.findByIdAndDelete(req.params.id)
})

module.exports = router