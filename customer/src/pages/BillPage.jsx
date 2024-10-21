import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Input, Space, Spin, message } from "antd";
import { FileExcelFilled, SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import PrintBill from "../components/bills/PrintBill";
import CheckOrder from "../components/bills/CheckOrder";
import AddOrClose from "../components/bills/AddorClose";
import Header from "../components/header/Header";
import { DownloadTableExcel } from "react-export-table-to-excel";

const BillPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isbillChecked, setIsbillChecked] = useState(false);
  const [billItems, setBillItems] = useState();
  const [customer, setCustomer] = useState();
  const tableRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  // Retrieve localStorage value to filter orders (e.g., by order number)
  const localOrderNumber = localStorage.getItem("customerToken");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const DeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/bills/delete-bill`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }), // Send the _id in the request body
        });
        if (res.ok) {
          message.success("Order Deleted successfully");
          // Optionally, refresh the bills list here after deletion.
          setBillItems((prev) => prev.filter((item) => item._id !== id));
        } else {
          console.log("Failed to delete Order");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return recordValue ? recordValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/bills/get-all");
        const data = await res.json();
        // Reverse the list to show latest orders first
        const reversed = data.reverse();
        
        // Filter bills based on the value stored in localStorage
        const filteredBills = reversed.filter((bill) => bill.customersidetoken === localOrderNumber);

        setBillItems(filteredBills);
      } catch (error) {
        console.log(error);
      }
    };
    getBills();
  }, [localOrderNumber]);

  const columns = [
    {
      title: "Table Number",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Order Number",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return <span>{text.substring(0, 10)}</span>;
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => {
        return <span>{text} &#2547;</span>;
      },
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Status",
      dataIndex: "checked",
      key: "checked",
      render: (checked, record) => {
        return (
          <span style={{ color: "green" }}>
            {record.completed
              ? "Completed"
              : checked
              ? "Active Order"
              : (
                <Button
                  type="link"
                  className="pl-0"
                  onClick={() => {
                    setIsbillChecked(true);
                    setCustomer(record);
                  }}
                >
                  Check Order
                </Button>
              )}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
              <>
                <Button
                  type="link"
                  className="pl-0"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setCustomer(record);
                  }}
                >
                  Add More Items
                </Button>
                </>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">Order List</h1>
      {billItems ? (
        <div className="px-6">
          <div className="cursor-pointer">
            {" "}
            <DownloadTableExcel
              filename="users table"
              sheet="users"
              currentTableRef={tableRef.current}
            >
              <FileExcelFilled className="ml-2" />
              <span className="pl-2 ">Download in Excel</span>
            </DownloadTableExcel>
          </div>
          <Table
            ref={tableRef}
            name="user-table"
            dataSource={billItems}
            columns={columns}
            bordered
            scroll={{ x: 1000, y: "100vh - 300px" }}
            rowKey="_id"
          />
        </div>
      ) : (
        <Spin
          size="large"
          style={{
            width: "100%",
          }}
          className=" absolute top-1/2 h-screen w-screen flex  justify-center"
          direction="vertical"
        />
      )}

      <PrintBill
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showModal={() => setIsModalOpen(true)}
        customer={customer}
      />

      <CheckOrder
        isModalOpen={isbillChecked}
        setIsModalOpen={setIsbillChecked}
        showModal={() => setIsbillChecked(true)}
        customer={customer}
      />

      <AddOrClose
        isModalOpen2={isModalOpen2}
        setIsModalOpen2={setIsModalOpen2}
        showModal={() => setIsModalOpen2(true)}
        customer={customer}
      />
    </>
  );
};

export default BillPage;
