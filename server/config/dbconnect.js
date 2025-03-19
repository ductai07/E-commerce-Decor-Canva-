const mongoose = require('mongoose')
const Product = require('../models/product')
const Category = require('../models/category')

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000, // Tăng timeout lên 30 giây
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        })
        
        if (conn.connection.readyState === 1) {
            console.log('MongoDB connection successful')
            
            // Check if there are any categories, if not, create sample categories
            const categoryCount = await Category.countDocuments().catch(err => 0)
            if (categoryCount === 0) {
                await createSampleCategories()
            }
            
            // Check if there are any products, if not, create sample data
            const productCount = await Product.countDocuments().catch(err => 0)
            if (productCount === 0) {
                await createSampleProducts()
            }
        } else {
            console.log('DB connecting')
        }
    } catch (error) {
        console.log('DB connection failed')
        console.error(error)
    }
}

const createSampleCategories = async () => {
    try {
        const categories = [
            {
                name: 'Phong Cảnh',
                slug: 'phong-canh'
            },
            {
                name: 'Trừu Tượng',
                slug: 'truu-tuong'
            },
            {
                name: 'Hoa & Thực Vật',
                slug: 'hoa-thuc-vat'
            },
            {
                name: 'Động Vật',
                slug: 'dong-vat'
            },
            {
                name: 'Chân Dung',
                slug: 'chan-dung'
            },
            {
                name: 'Đời Sống & Thành Thị',
                slug: 'doi-song-thanh-thi'
            },
            {
                name: 'Trích Dẫn & Chữ Nghệ Thuật',
                slug: 'trich-dan-chu-nghe-thuat'
            }
        ]
        
        console.log('Creating sample categories...')
        const createdCategories = await Category.insertMany(categories)
        console.log('Sample categories created successfully')
        return createdCategories
    } catch (error) {
        console.error('Error creating sample categories:', error)
        return []
    }
}

const createSampleProducts = async () => {
    try {
        // Get categories or use empty array if fails
        const categories = await Category.find().catch(err => [])
        
        // Map to store category IDs by name for easier reference
        const categoryMap = {}
        categories.forEach(cat => {
            categoryMap[cat.name] = cat._id
        })
        
        const sampleProducts = [
            // XU HƯỚNG TRANH CANVAS
            {
                title: 'Tranh Canvas Cafe Sáng',
                slug: 'tranh-canvas-cafe-sang',
                brand: 'DucTai-Decor',
                price: 750000,
                category: categoryMap['Đời Sống & Thành Thị'],
                quantity: 10,
                sold: 0,
                images: ["https://storage.googleapis.com/a1aa/image/cutLM2wo50jO3xrlJjek5MLM216aK1vHDyECk1kKUqQ.jpg"],
                color: 'Brown',
                description: 'Tranh canvas phong cách cà phê sáng, tạo không gian ấm cúng cho phòng ăn hoặc phòng khách của bạn.'
            },
            {
                title: 'Tranh Canvas Biển Xanh Vỗ Bờ',
                slug: 'tranh-canvas-bien-xanh-vo-bo',
                brand: 'DucTai-Decor',
                price: 890000,
                category: categoryMap['Phong Cảnh'],
                quantity: 15,
                sold: 3,
                images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Blue',
                description: 'Tranh biển xanh ngắt với sóng vỗ bờ, mang đến cảm giác mát mẻ và thư giãn cho không gian sống.'
            },
            {
                title: 'Tranh Canvas Trừu Tượng Hiện Đại',
                slug: 'tranh-canvas-truu-tuong-hien-dai',
                brand: 'DucTai-Decor',
                price: 850000,
                category: categoryMap['Trừu Tượng'],
                quantity: 8,
                sold: 2,
                images: ["https://storage.googleapis.com/a1aa/image/LNYJJP6BzXBpRg5bV8jca5sdve35J3hAJ2IEdzYlt_4.jpg"],
                color: 'Blue',
                description: 'Tranh canvas phong cách trừu tượng hiện đại với gam màu xanh dương chủ đạo, phù hợp với không gian sống hiện đại.'
            },
            {
                title: 'Tranh Canvas Phố Cổ Hội An',
                slug: 'tranh-canvas-pho-co-hoi-an',
                brand: 'DucTai-Decor',
                price: 950000,
                category: categoryMap['Phong Cảnh'],
                quantity: 7,
                sold: 5,
                images: ["https://images.unsplash.com/photo-1540695421975-81e675252697?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Yellow',
                description: 'Tranh phố cổ Hội An với ánh đèn lồng rực rỡ, mang đến không gian ấm cúng và đậm chất Việt Nam.'
            },
            {
                title: 'Tranh Canvas Hoa Hướng Dương',
                slug: 'tranh-canvas-hoa-huong-duong',
                brand: 'DucTai-Decor',
                price: 650000,
                category: categoryMap['Hoa & Thực Vật'],
                quantity: 12,
                sold: 8,
                images: ["https://storage.googleapis.com/a1aa/image/o4GLdu34B3IKqKrCAzne0sJY_wIpRLyjcIfCM83VWmY.jpg"],
                color: 'Yellow',
                description: 'Tranh canvas hoa hướng dương rực rỡ, tạo điểm nhấn tươi sáng và năng động cho không gian.'
            },
            
            // CÁC DÒNG SẢN PHẨM
            {
                title: 'Tranh Canvas Chân Dung Minimalist',
                slug: 'tranh-canvas-chan-dung-minimalist',
                brand: 'DucTai-Decor',
                price: 780000,
                category: categoryMap['Chân Dung'],
                quantity: 10,
                sold: 2,
                images: ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Black',
                description: 'Bộ tranh chân dung phong cách minimalist, với đường nét đơn giản nhưng tinh tế.'
            },
            {
                title: 'Tranh Canvas Thành Phố Về Đêm',
                slug: 'tranh-canvas-thanh-pho-ve-dem',
                brand: 'DucTai-Decor',
                price: 1200000,
                category: categoryMap['Đời Sống & Thành Thị'],
                quantity: 5,
                sold: 1,
                images: ["https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2024&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Blue',
                description: 'Tranh thành phố về đêm với ánh đèn lung linh, tạo không gian sang trọng và hiện đại.'
            },
            {
                title: 'Bộ 3 Tranh Canvas Hoa Sen',
                slug: 'bo-3-tranh-canvas-hoa-sen',
                brand: 'DucTai-Decor',
                price: 1500000,
                category: categoryMap['Hoa & Thực Vật'],
                quantity: 8,
                sold: 3,
                images: ["https://images.unsplash.com/photo-1606293926249-9390535b676b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Pink',
                description: 'Bộ 3 tranh hoa sen thanh thoát, biểu tượng của sự tinh khiết và bình yên.'
            },
            {
                title: 'Tranh Canvas Núi Tuyết',
                slug: 'tranh-canvas-nui-tuyet',
                brand: 'DucTai-Decor',
                price: 850000,
                category: categoryMap['Phong Cảnh'],
                quantity: 10,
                sold: 0,
                images: ["https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'White',
                description: 'Tranh phong cảnh núi tuyết hùng vĩ, mang đến cảm giác mạnh mẽ và tự do.'
            },
            {
                title: 'Tranh Canvas Chữ Nghệ Thuật - Follow Your Heart',
                slug: 'tranh-canvas-chu-nghe-thuat-follow-your-heart',
                brand: 'DucTai-Decor',
                price: 550000,
                category: categoryMap['Trích Dẫn & Chữ Nghệ Thuật'],
                quantity: 15,
                sold: 7,
                images: ["https://images.unsplash.com/photo-1561989816-c43d988ffa2a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'White',
                description: 'Tranh canvas với câu trích dẫn truyền cảm hứng, phù hợp cho không gian làm việc và học tập.'
            },
            {
                title: 'Bộ Tranh Canvas Động Vật Rừng',
                slug: 'bo-tranh-canvas-dong-vat-rung',
                brand: 'DucTai-Decor',
                price: 1800000,
                category: categoryMap['Động Vật'],
                quantity: 5,
                sold: 2,
                images: ["https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Brown',
                description: 'Bộ tranh động vật hoang dã với hình ảnh sư tử, hổ, voi... sống động và đầy ấn tượng.'
            },
            {
                title: 'Tranh Canvas Abstract Art',
                slug: 'tranh-canvas-abstract-art',
                brand: 'DucTai-Decor',
                price: 1100000,
                category: categoryMap['Trừu Tượng'],
                quantity: 7,
                sold: 3,
                images: ["https://images.unsplash.com/photo-1536924430914-91f9e2041b83?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Red',
                description: 'Tranh nghệ thuật trừu tượng với sự kết hợp màu sắc táo bạo, tạo điểm nhấn độc đáo cho không gian.'
            },
            {
                title: 'Tranh Canvas Phong Cảnh Làng Quê Việt Nam',
                slug: 'tranh-canvas-phong-canh-lang-que-viet-nam',
                brand: 'DucTai-Decor',
                price: 950000,
                category: categoryMap['Phong Cảnh'],
                quantity: 10,
                sold: 5,
                images: ["https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Green',
                description: 'Tranh phong cảnh làng quê Việt Nam với cánh đồng lúa xanh ngát, gợi nhớ về vẻ đẹp bình dị của quê hương.'
            },
            {
                title: 'Tranh Canvas Bướm Nghệ Thuật',
                slug: 'tranh-canvas-buom-nghe-thuat',
                brand: 'DucTai-Decor',
                price: 680000,
                category: categoryMap['Động Vật'],
                quantity: 12,
                sold: 6,
                images: ["https://images.unsplash.com/photo-1525060791-550234fd756c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Blue',
                description: 'Tranh bướm nghệ thuật với màu sắc rực rỡ, tượng trưng cho sự tự do và biến đổi.'
            },
            {
                title: 'Tranh Canvas Tĩnh Vật Hoa Quả',
                slug: 'tranh-canvas-tinh-vat-hoa-qua',
                brand: 'DucTai-Decor',
                price: 720000,
                category: categoryMap['Đời Sống & Thành Thị'],
                quantity: 8,
                sold: 2,
                images: ["https://images.unsplash.com/photo-1573273787173-0eb81a833b34?q=80&w=2025&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Green',
                description: 'Tranh tĩnh vật với hoa quả tươi ngon, mang đến không gian ấm cúng cho phòng ăn.'
            },
            {
                title: 'Tranh Canvas Phật Giáo Zen',
                slug: 'tranh-canvas-phat-giao-zen',
                brand: 'DucTai-Decor',
                price: 850000,
                category: categoryMap['Đời Sống & Thành Thị'],
                quantity: 10,
                sold: 8,
                images: ["https://images.unsplash.com/photo-1507644636607-e72f1a50e25e?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3"],
                color: 'Black',
                description: 'Tranh Phật giáo với phong cách Zen tối giản, mang đến sự bình yên cho không gian sống.'
            }
        ]
        
        console.log('Creating sample products...')
        await Product.insertMany(sampleProducts)
        console.log('Sample products created successfully')
    } catch (error) {
        console.error('Error creating sample products:', error)
    }
}

module.exports = dbConnect