import React from "react";
import { Button, Card, Form, Input, message, Modal, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset } from "../../redux/cartSlice";
import PhoneInput from 'react-phone-number-input'
import { useState } from "react";
import "./style.css"
import Phoneinputbox from "../phoneNumberinput/phoneinputbox";

const CreateBill = ({ isModalOpen, setIsModalOpen }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState()

  const onFinish = async (values) => {
    try {
      // Construct a string from customer details like name, phone, and cart items
      const customerToken = `${tablenumber}${values.customerPhoneNumber}${cart.cartItems.map(item => item.name).join("")}`;
  
      // Save the token in localStorage (optional)
      localStorage.setItem("customerToken", customerToken);
  
      // Make API call to create the bill
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/bills/add-bill", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          subTotal: cart.total.toFixed(2),
          tax: ((cart.total * cart.tax) / 100).toFixed(2),
          totalAmount: (cart.total + (cart.total * cart.tax) / 100).toFixed(2),
          cartItems: cart.cartItems,
          customersidetoken: customerToken, // Add the generated string to the request payload
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      if (res.status === 200) {
        message.success("Your Order Was Created Successfully!");
        dispatch(reset());
        navigate("/");
      }
    } catch (error) {
      message.error("Error Ordering. Sorry!");
      console.log(error);
    }
  };
  

  const tablenumber = localStorage.getItem('tableId')

  return (
    <Modal
      title="Create Order"
      open={isModalOpen}
      footer={false}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form layout={"vertical"} onFinish={onFinish}>
        <Form.Item
          label="Table Number"
          name={"customerName"}
          initialValue={tablenumber}
        >
          <span>{tablenumber}</span>
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
          <Input placeholder="Enter Your Name" />

        </Form.Item>
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