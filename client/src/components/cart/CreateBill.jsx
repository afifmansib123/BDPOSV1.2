import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Modal, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset } from "../../redux/cartSlice";
import Phoneinputbox from "../phoneNumberinput/phoneinputbox";

const CreateBill = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [localdata, setlocaldata] = useState({})
  const [activetables, setactivetables] = useState([])

  useEffect(() => {
    let x = localStorage.getItem("OederToken")
    setlocaldata(JSON.parse(x))
  }, [])

  // code to check if the tables are free or occupied

  useEffect(() => {
    const getOrders = async () => {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/bills/get-all`);
      const allOrders = await res.json();
      const activeTables = allOrders
        .filter(order => order.checked === true && order.completed === false) // Check for active, non-completed orders
        .map(order => order.customerName);
      
      setactivetables(activeTables); // Set only active tables that are not completed
    };
  
    getOrders();
  }, []);
  

  const onFinish = async (values) => {
    if (activetables.includes(values.customerName)) {
      alert('the table is currently busy')
    } else {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/bills/add-bill", {
          method: "POST",
          body: JSON.stringify({
            ...values,
            subTotal: cart.total.toFixed(2),
            tax: ((cart.total * cart.tax) / 100).toFixed(2),
            totalAmount: (cart.total + (cart.total * cart.tax) / 100).toFixed(2),
            cartItems: cart.cartItems,
            checked: cart.checked,
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (res.status === 200) {
          message.success("Order Created Successfully");
          localStorage.removeItem("OederToken");
          localStorage.removeItem("cart");
          dispatch(reset());
          navigate("/bills");
        }
      } catch (error) {
        message.danger("Something went wrong");
        console.log(error);
      }
    }
  };

  return (
    <Modal
      title="Create Order"
      open={isModalOpen}
      footer={false}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form layout={"vertical"} onFinish={onFinish}
        initialValues={{
          customerName: localdata && localdata.customerName,
          customerRealName: localdata && localdata.customerRealName,
        }}
      >
        <Form.Item
          label="Table Number"
          name={"customerName"} // using this as the table number
          rules={[
            {
              required: true,
              message: "Table Number is required",
            },
          ]}
        >
          {localdata && localdata.customerName ? (<span>{localdata.customerName}</span>) : (<Input placeholder="Enter Table Number" />)}

        </Form.Item>
        <Form.Item
          label="Customer Name"
          name={"customerRealName"}
          rules={[
            {
              required: true,
              message: "Name is required",
            },
          ]}
        >
          {localdata && localdata.customerName ? (<span>{localdata.customerRealName}</span>) : (<Input placeholder="Enter Your Name" />)}

        </Form.Item>
        {/* 
        <Form.Item
          rules={[{ required: true }]}
          name={"customerPhoneNumber"}
          label="Tel No"
        >
          <Phoneinputbox />

        </Form.Item>
        */}
        <Form.Item
          label="Payment Method"
          rules={[{ required: true }]}
          name={"paymentMode"}
        >
          <Select placeholder="Please Select a Payment Method">
            <Select.Option value="Cash">Cash</Select.Option>
            <Select.Option value="Credit Card">Credit Card</Select.Option>
          </Select>
        </Form.Item>
        <Card>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{cart.total > 0 ? cart.total.toFixed(2) : 0}&#2547;</span>
          </div>
          <div className="flex justify-between my-2">
            <span>Tax %{cart.tax}</span>
            <span className="text-red-600">
              {(cart.total * cart.tax) / 100 > 0
                ? `+${((cart.total * cart.tax) / 100).toFixed(2)}`
                : 0}
              &#2547;
            </span>
          </div>
          <div className="flex justify-between">
            <b>Total Payment</b>
            <b>
              {cart.total + (cart.total * cart.tax) / 100 > 0
                ? (cart.total + (cart.total * cart.tax) / 100).toFixed(2)
                : 0}
              &#2547;
            </b>
          </div>
          <div className="flex justify-end">
            <Button
              className="mt-4"
              type="primary"
              onClick={() => setIsModalOpen(true)}
              htmlType="submit"
              disabled={cart.cartItems.length === 0}
            >
              Create Order
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateBill;