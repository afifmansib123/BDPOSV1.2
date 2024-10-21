import React, { useRef } from "react";
import { Button, Modal } from "antd";

const CheckOrder = ({ isModalOpen, setIsModalOpen, customer }) => {
  const componentRef = useRef();

  const DeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/bills/delete-bill`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: id }), // Send the _id in the request body
        });
        if (res.ok) {
          message.success("Order Deleted successfully");
          // Optionally, refresh the bills list here after deletion.
          // e.g., setBillItems((prev) => prev.filter(item => item._id !== id));
        } else {
          console.log("Failed to delete Order");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const MakeOrderSeen = async (id) => {
    try {
      fetch(process.env.REACT_APP_SERVER_URL + "/bills/update-bill", {
        method: "PUT",
        body: JSON.stringify({ _id: id, checked: true }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Order Checked Successfully");
    } catch (error) {
      message.error("Something went wrong.");
      console.log(error); s
    }
  }

  return (
    <Modal
      title="Order Details"
      open={isModalOpen}
      footer={false}
      onCancel={() => setIsModalOpen(false)}
      width={800}
    >
      <section className="py-20 bg-blue-50" ref={componentRef}>
        <div className="max-w-5xl mx-auto bg-white px-6">
          <article className="overflow-hidden">
            <div className="logo my-6">
              <h2 className="text-4xl font-bold text-slate-700">BDPOS</h2>
              <div className="flex justify-end">
              <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={()=>{
                MakeOrderSeen(customer?._id)
                setIsModalOpen(false)
              }}
              >
              Accept Order
            </button>
            <button class="ml-5 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={()=>{
              DeleteOrder(customer?._id)
            }}
            >
              Delete Order
            </button>
            </div>
            </div>
            
            <div className="bill-details">
              <div className="grid sm:grid-cols-4 grid-cols-3 gap-12">
                <div className="text-md text-slate-500">
                  <p className="font-bold text-slate-700">Table Number</p>
                  <p>{customer?.customerName}</p>
                </div>
                <div className="text-md text-slate-500">
                  <p className="font-bold text-slate-700">PhoneNumber</p>
                  <p> {customer?.customerPhoneNumber}</p>
                </div>
                <div className="text-md text-slate-500">
                  <div>
                    <p className="font-bold text-slate-700">Payment Method</p>
                    <p> {customer?.paymentMode} </p>
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
                  {customer?.cartItems
                    .map((item, _id) => (
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
                              Item Price {item.price.toFixed(2)}  ৳
                            </span>
                          </div>
                        </td>
                        <td className="py-4 sm:hidden" colSpan={4}>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.title}</span>
                            <span className="sm:hidden inline-block text-xs">
                              Item Price {item.price.toFixed(2)}  ৳
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-center sm:table-cell hidden">
                          <span>{item.price.toFixed(2)}  ৳</span>
                        </td>
                        <td className="py-4 sm:text-center text-right sm:table-cell hidden">
                          <span>{item.quantity}</span>
                        </td>
                        <td className="py-4 text-end">
                          <span>
                            {(item.price * item.quantity).toFixed(2)}  ৳
                          </span>
                        </td>
                      </tr>
                    ))
                    .reverse()}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      className="text-right pt-4 sm:table-cell hidden"
                      colSpan="4"
                      scope="row"
                    >
                      <span className="font-normal text-slate-700">
                        Subtotal
                      </span>
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
                        {customer?.subTotal.toFixed(2)}  ৳
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
                        {customer?.tax.toFixed(2)}  ৳
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <th
                      className="text-right pt-4 sm:table-cell hidden"
                      colSpan="4"
                      scope="row"
                    >
                      <span className="font-normal text-slate-700">
                        SubTotal
                      </span>
                    </th>
                    <th
                      className="text-left pt-4 sm:hidden"
                      scope="row"
                      colSpan="4"
                    >
                      <p className="font-normal text-slate-700">SubTotal</p>
                    </th>
                    <th className="text-right pt-4" scope="row">
                      <span className="font-normal text-slate-700">
                        {" "}
                        <b>{customer?.totalAmount.toFixed(2)}  ৳</b>
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

export default CheckOrder;