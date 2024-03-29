import { Router } from "express"
import ProductManager from '../dao/fsManagers/ProductManager.js'
import ProductModel from '../dao/models/product.model.js';
import cartModel from "../dao/models/cart.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
      //const products = await ProductModel.find().lean().exec();
      let pageNum = parseInt(req.query.page) || 1;
      let itemsPorPage = parseInt(req.query.limit) || 10;
      const products = await ProductModel.paginate({}, { page: pageNum , limit: itemsPorPage , lean:true });

      products.prevLink = products.hasPrevPage ? `/products?limit=${itemsPorPage}&page=${products.prevPage}` : '';
      products.nextLink = products.hasNextPage ? `/products?limit=${itemsPorPage}&page=${products.nextPage}` : '';
      

      console.log(products);
      
      res.render('home', products);
    } catch (error) {
      console.log('Error al leer los productos:', error);
      res.status(500).json({ error: 'Error al leer los productos' });
    }
  });
  
  router.get('/realtimeproducts', async (req, res) => {
    try {
      const products = await ProductModel.find().lean().exec();
      res.render('realTimeProducts', { products });
    } catch (error) {
      console.log('Error al leer los productos en tiempo real:', error);
      res.status(500).json({ error: 'Error al leer los productos en tiempo real' });
    }
  });

  router.get('/:cid', async (req, res) => {
    try {
      const id = req.params.cid
      const result = await ProductModel.findById(id).lean().exec();
      if (result === null) {
        return res.status(404).json({ status: 'error', error: 'Product not found' });
      }
      res.render('productDetail', result);
    } catch (error) {
      res.status(500).json({ error: 'Error al leer los productos' });
    }
  })

  router.get('/carts/:cid', async (req, res) => {
    // ID del carrito: 65e617f6d8786b8bff70b7a7
    try {
      const id = req.params.cid
      const result = await cartModel.findById(id).lean().exec();
      if (result === null) {
        return res.status(404).json({ status: 'error', error: 'Cart not found' });
      }
      res.render('carts', { cid: result._id, products: result.products });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  })
  
  export default router;
