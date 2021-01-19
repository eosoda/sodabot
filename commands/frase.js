bot.command('frase', (ctx) => {
    getFrase()
    .then((result) => {
        ctx.telegram.sendMessage(ctx.chat.id, result)
    })

})

async function getFrase(){
    url = 'https://www.42frases.com.br/wp-json/wp/v2/posts'
    nr = Math.floor(Math.random() * 100) + 1
    let res = await axios.get(url)
    texto = res.data[nr].content.rendered
    texto = texto.replace(/<(.|\n)*?>/g, '');
    // console.log(texto)
    return texto
}
