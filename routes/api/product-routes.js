const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }]
    });

    res.status(200).json(productData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const productData = await Product.findByPk(req.params.id, { include: [{ model: Category }, { model: Tag }], });

    if (!productData) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(productData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbProductData => {
      if (!dbProductData[0]) {
        res.status(400).json({ message: 'No product was found with this id' });
        return;
      }
      res.json('Product Updated');
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
    })
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json('Product Deleted');

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;