import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from './models/Product.js';

const app = express();
app.use(express.json());

const connectMongoDB = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    if(connection){
        console.log('Connected to MongoDB');
    }
}
connectMongoDB();

app.post('/product', async (req,res)=>{

    // const name = req.body.name;
    // const price = req.body.price;
    // const description = req.body.description;
    const {name, price, description } = req.body;

    const product = new Product({
        name:name,
        price: price,
        description: description
    });

    const savedProduct = await product.save();

    res.json({
        success:true,
        data:product,
        message:'Product added successfully'
    })  
})


app.get('/products', async (req, res)=>{

    const products = await Product.find(); 

    res.json({
        success: true,
        data: products,
        message: 'Product retrieved successfully'
    })   
})

app.get('/product/:id', async (req, res)=>{
    const {id} = req.params;

    const product = await Product.findOne({_id: id});

    res.json({
        success: true,
        data: product,
        message: 'Product retrieved successfully'
    })
})

app.delete("/product/:id", async (req, res)=> {
    const {id} = req.params;

    await Product.deleteOne({_id: id});

    res.json({
        success: true,
        message: 'Product deleted successfully'
    })
})

app.put("/product/:id", async (req, res)=> {
    const {id} = req.params;
    const {name, price, description} = req.body;

    await Product.updateOne({_id: id}, {$set: {
        name: name,
        price: price,
        description: description
    }});
     
    const updateProduct = await Product.findOne({_id: id});

    res.json({
        success: true,
        data: updateProduct,
        message: 'Product update successfully'
    })
});

const PORT =5000;

app.listen(PORT, ()=>{
    console.log('Server is running on port ${PORT}');
});