const User =  require("../models/User")

async function post(req, res, next) {
    // check all fields
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render("user/register", {
                user: req.body,
                error: 'Por favor, preencha todos os campos!'
            })
        }
    }

    // check if user already exists
    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj } 
    })

    if (user) return res.render("user/register", {
        user: req.body,
        error: 'Usuário já existe!'
    })

    // check if passwords match
    if (password != passwordRepeat)
        return res.render("user/register", {
            user: req.body,
            error: 'Senhas não combinam!'
        })

    next()
}

module.exports = {
    post
}