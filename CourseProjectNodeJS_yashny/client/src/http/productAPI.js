import {$host, $authHost} from './index'

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}

export const fetchBrands = async () => {
    const {data} = await $host.get('api/brand')
    return data
}

export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product)
    return data
}

export const fetchProducts = async (typeId, brandId, isSold, page, limit = 5) => {
    const {data} = await $host.get('api/product', {params: {
        typeId, brandId, isSold, page, limit
    }})
    return data
}

export const fetchOneProduct = async (id) => {
    const {data} = await $host.get('api/product/' + id)
    return data
}

export const deleteProduct = async (id) => {
    const {data} = await $authHost.delete(`api/product/${id}`)
    return data
}

export const updateProduct = async (id, product) => {
    const {data} = await $authHost.put(`api/product/${id}`, product)
    return data
}

export const createRate = async (rate) => {
    const {data} = await $authHost.post(`api/rate`, rate)
    return data
}

export const getBasket = async (userId) => {
    const {data} = await $authHost.get(`api/basket/${userId}`)
    return data
}

export const addToBasket = async (params) => {
    const {data} = await $authHost.post(`api/basket`, params)
    return data
}

export const deleteFromBasket = async (userId, productId) => {
    const {data} = await $authHost.delete(`api/basket/${userId}/${productId}`)
    return data
}

export const getUserOrders = async (userId) => {
    const {data} = await $authHost.get(`api/order/${userId}`)
    return data
}

export const getOneUserOrder = async (userId, orderId) => {
    const {data} = await $authHost.get(`api/order/${userId}/${orderId}`)
    return data
}

export const deleteOrder = async (orderId) => {
    const {data} = await $authHost.delete(`api/order/${orderId}`)
    return data
}

export const makeOrder = async (userId) => {
    const {data} = await $authHost.post(`api/order/${userId}`)
    return data
}

export const getAllOrders = async (params) => {
    const {data} = await $authHost.get(`api/order`, params)
    return data
}

export const changeStatus = async (params) => {
    const {data} = await $authHost.put(`api/order/`, params)
    return data
}