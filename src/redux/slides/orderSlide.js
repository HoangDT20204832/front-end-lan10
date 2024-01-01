import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected :[],
    idsOrderReviewed : [],
    shippingAddress: {                                          // giao hàng
        // fullName: { type: String, required: true },             //tên người nhận
        // address: { type: String, required: true },              //địa chỉ giao hàng
        // city: { type: String, required: true },                 //thành phố
        // phone: { type: Number, required: true },                //sdt của người nhận
    },
    paymentMethod: "",         //phương thức thanh toán
    deliveryMethod:"" ,        //phương thức giao hàng
    itemsPrice: 0,              //tổng giá các sản phẩm
    shippingPrice: 0,           // phí giao hàng
    totalPrice: 0,             //tổng giá tiền cuối cùng của đơn hàng
    user: "",
    isPaid: false,                 // xác định đã thanh toán hay chưa
    paidAt: "",                                    //thời điểm thanh toán
    isDelivered: "",             // các đơn vị đã giao hàng hay chưa 
    deliveredAt: "",  
}

export const orderSlide = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) =>{
        // console.log("addOrderProduct", state, action)
        const {orderItem} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
                         //kiểm tra xem có sản phẩm có idProduct có sẵn trong orderItems bằng với idProduct mình đã truyền lên khi ấn thêm vào giỏ hàng
                         //nếu có thì khi ấn thêm giỏ hàng thì số lượng sản phẩm trong order = số lượng sản phẩm đó có sẵn trong đơn hàng + số lượng sản phẩm vừa mới ấn vào nút thêm giỏ hàng
        if(itemOrder){
            itemOrder.amount = itemOrder.amount + orderItem?.amount //nếu sản phẩm ấn thêm giỏ hàng đã có sẵn trong đơn hàng thì sẽ + thêm với số sản phẩm vauwuf ấn thêm giỏ hàng
        }else{
            state.orderItems.push(orderItem)  //nếu sản phẩm ấn thêm giỏ hàng chưa có sẵn trong đơn hàng thì sẽ thêm nó vào đơn hàng
        }
    },

    increaseAmount : (state, action) =>{
        // console.log("remove", state, action)
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
        const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
        itemOrder.amount++;
        if(itemOrderSelected) {
          itemOrderSelected.amount++;
        }
    },
    
    decreaseAmount : (state, action) =>{
        // console.log("remove", state, action)
      const {idProduct} = action.payload
      const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
      const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
      itemOrder.amount--;
      if(itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },

    removeOrderProduct: (state, action) =>{
        const {idProduct} = action.payload
        const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct) //lấy ra những sản phẩm trong đơn hàng ko có idProduct trùng với id của sản phẩm đã xóa
        const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct) //lấy ra những sản phẩm trong đơn hàng đã "selected" ko có idProduct trùng với id của sản phẩm đã xóa khi selected
        state.orderItems= itemOrder 
        state.orderItemsSelected= itemOrderSelected
    },

    removeAllOrderProduct: (state, action) =>{
        // console.log("remove", state, action)
        const {listChecked} = action.payload
        const itemOrders = state?.orderItems?.filter((item) => {
            return (!listChecked.includes(item.product))
        }) //lấy ra những sản phẩm trong đơn hàng ko có idProduct trùng với id của các sản phẩm đã xóa
        
        const itemOrdersSelected = state?.orderItemsSelected?.filter((item) => {
            return (!listChecked.includes(item.product))
        })
        state.orderItems= itemOrders  
        state.orderItemsSelected= itemOrdersSelected  
    },

    selectOrder: (state, action) =>{
        // console.log("select", state, action)
        const orderSelected = []
        const {listChecked} = action.payload
        state.orderItems.forEach((order) =>{
            if(listChecked.includes(order.product)){
                orderSelected.push(order)
        }
        state.orderItemsSelected = orderSelected
    })
    },

    updateIdsOrderReviewed: (state , action) => {
        // console.log("action.payload", action.payload)
        const idOrdered = action.payload
        state.idsOrderReviewed= [...state.idsOrderReviewed, idOrdered ]
        // console.log("updateIdsOrderReviewed",state?.idsOrderReviewed )
    }
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct,increaseAmount, decreaseAmount, 
    removeOrderProduct,removeAllOrderProduct ,selectOrder,
    updateIdsOrderReviewed} = orderSlide.actions

export default orderSlide.reducer 