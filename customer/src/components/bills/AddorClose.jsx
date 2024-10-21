import React, { useEffect } from "react";
import { Modal, Button } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";

const AddOrClose = ({ isModalOpen2, setIsModalOpen2, customer }) => {
  const dispatch = useDispatch();

  // Automatically add items to cart when modal opens
  useEffect(() => {
    
  }, [customer, dispatch]);

  const AddtoOrder = async (id) => {
    if (window.confirm("Your Order Will be Modified Now. Continue ?")) {
      if (customer?.cartItems) {
        customer.cartItems.forEach((item) => {
          dispatch(addProduct(item)); // Dispatch action to add each item to the cart
        });
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/bills/delete-bill`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: id }), // Send the _id in the request body
        });
        if (res.ok) {
          message.success("Order Modified");
          // Optionally, refresh the bills list here after deletion.
          // e.g., setBillItems((prev) => prev.filter(item => item._id !== id));
        } else {
          console.log("Failed");
        }
      } catch (err) {
        console.log(err);
      }
    }
    const newobject = {
      customerId: customer._id,
      customerName: customer.customerName,
      customerPhoneNumber: customer.customerPhoneNumber,
      customerRealName : customer.customerRealName,
      

    }
    localStorage.setItem("OederToken", JSON.stringify(newobject))
  };

  const CloseOrder = async (id) => {
    try {
      fetch(process.env.REACT_APP_SERVER_URL + "/bills/update-bill", {
        method: "PUT",
        body: JSON.stringify({ _id: id, completed: true }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Order Checked Successfully");
    } catch (error) {
      message.error("Something went wrong.");
      console.log(error); 
    }
  }

  return (
    <Modal
      title="Order Details"
      open={isModalOpen2}
      footer={false}
      onCancel={() => 
        {
        localStorage.removeItem("cart")
        setIsModalOpen2(false)
        }
      }
      width={800}
    >
      <section className="py-20 bg-blue-50">
        <div className="max-w-5xl mx-auto bg-white px-6">
          <article className="overflow-hidden">
            <div className="logo my-6">
              <h2 className="text-4xl font-bold text-slate-700">BDPOS</h2>
              <div className="flex justify-end">
                <Link to="/">
                  <Button className="ml-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white px-4 border border-blue-500 hover:border-transparent rounded" onClick={()=>{AddtoOrder(customer._id)}}>
                    Add Items
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bill-details mt-10">
              <div className="grid sm:grid-cols-4 grid-cols-3 gap-12">
                <div className="text-md text-slate-500">
                  <p className="font-bold text-slate-700">Table Number</p>
                  <p>{customer?.customerName}</p>
                </div>
                <div className="text-md text-slate-500">
                  <p className="font-bold text-slate-700">PhoneNumber</p>
                  <p>{customer?.customerPhoneNumber}</p>
                </div>
                <div className="text-md text-slate-500">
                  <div>
                    <p className="font-bold text-slate-700">Payment Method</p>
                    <p>{customer?.paymentMode}</p>
                  </div>
                </div>
                <div className="text-md text-slate-500 sm:block hidden">
                  <div>
                    <p className="font-bold text-slate-700">Date</p>
                    <p>{customer?.createdAt.substring(0, 10)}</p>
                    <p>{customer?.createdAt.substring(11, 16)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bill-table-area mt-8">
              <table className="min-w-full divide-y divide-slate-500 overflow-hidden">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-normal text-slate-700 md:pl-0 sm:table-cell hidden"
                    >
                      Picture
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-normal text-slate-700 md:pl-0 sm:table-cell hidden"
                    >
                      {" "}
                      Item
                    </th>
                    <th
                      colSpan={4}
                      scope="col"
                      className="py-3.5 text-left text-sm font-normal text-slate-700 md:pl-0 sm:hidden"
                    >
                      {" "}
                      Item
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-center text-sm font-normal text-slate-700 md:pl-0 sm:table-cell hidden"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-center text-sm font-normal text-slate-700 md:pl-0 sm:table-cell hidden"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-end text-sm font-normal text-slate-700 md:pl-0"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customer?.cartItems.map((item, _id) => (
                    <tr className="border-b border-slate-200" key={item._id}>
                      <td className="py-4 sm:table-cell hidden">
                        <img
                          src={item.img ? item.img : "images/product.png"}
                          alt=""
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="py-4 sm:table-cell hidden">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="sm:hidden inline-block text-xs">
                            Item Price {item.price.toFixed(2)} ৳
                          </span>
                        </div>
                      </td>
                      <td className="py-4 sm:hidden" colSpan={4}>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="sm:hidden inline-block text-xs">
                            Item Price {item.price.toFixed(2)} ৳
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center sm:table-cell hidden">
                        <span>{item.price.toFixed(2)} ৳</span>
                      </td>
                      <td className="py-4 sm:text-center text-right sm:table-cell hidden">
                        <span>{item.quantity}</span>
                      </td>
                      <td className="py-4 text-end">
                        <span>{(item.price * item.quantity).toFixed(2)} ৳</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      className="text-right pt-4 sm:table-cell hidden"
                      colSpan="4"
                      scope="row"
                    >
                      <span className="font-normal text-slate-700">Subtotal</span>
                    </th>
                    <th
                      className="text-left pt-4 sm:hidden"
                      scope="row"
                      colSpan="4"
                    >
                      <p className="font-normal text-slate-700">Total</p>
                    </th>
                    <th className="text-right pt-4" scope="row">
                      <span className="font-normal text-slate-700">
                        {customer?.subTotal.toFixed(2)} ৳
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <th
                      className="text-right pt-4 sm:table-cell hidden"
                      colSpan="4"
                      scope="row"
                    >
                      <span className="font-normal text-slate-700">Tax</span>
                    </th>
                    <th
                      className="text-left pt-4 sm:hidden"
                      scope="row"
                      colSpan="4"
                    >
                      <p className="font-normal text-slate-700">Tax</p>
                    </th>
                    <th className="text-right pt-4" scope="row">
                      <span className="font-normal text-red-600">
                        {customer?.tax.toFixed(2)} ৳
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <th
                      className="text-right pt-4 sm:table-cell hidden"
                      colSpan="4"
                      scope="row"
                    >
                      <span className="font-normal text-slate-700">Total</span>
                    </th>
                    <th
                      className="text-left pt-4 sm:hidden"
                      scope="row"
                      colSpan="4"
                    >
                      <p className="font-normal text-slate-700">Total</p>
                    </th>
                    <th className="text-right pt-4" scope="row">
                      <span className="font-normal text-slate-700">
                        <b>{customer?.totalAmount.toFixed(2)} ৳</b>
                      </span>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </article>
        </div>
      </section>
    </Modal>
  );
};

export default AddOrClose;
