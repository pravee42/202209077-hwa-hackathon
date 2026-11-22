import { products } from '../_data/products.js';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ products: products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image
  })) });
}
