const Product = require('../models/Product')

const { formatPrice } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if (!products) return res.send('Products not found!')

        async function getImage(productId) {
            let results = await Product.files(productId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const productsPromise = products.map(async product => {
            product.img = await getImage(product.id)
            product.price = formatPrice(product.price)
            product.oldPrice = formatPrice(product.old_price)
            return product      
        }).filter((product, index) => index > 2 ? false : true) // if ternário: se index maior que 2, retorne false, se não retorne true //

        const lastAdded = await Promise.all(productsPromise)

        return res.render('home/index', { products: lastAdded })
    }
}