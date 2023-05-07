const express = require("express");
const cors = require("cors");
const path = require("path");
const RunDB = require("./DB/ConnectDB");
const { PostRouter, UserRouter } = require("./Router/app");
const { upload } = require("./Middleware/multer");
const app = express();
app.use(express.json());
require("dotenv").config();
app.use("/PIC", express.static(path.join(__dirname, "/PIC")));
const { createInvoice } = require("./Helper/pdf");
const sendEmail = require("./Helper/mail");
app.use(upload.array("image", 15));
app.use(cors());
app.use(UserRouter, PostRouter);

app.get("/", (req, res) => res.send("Hello World!"));

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000,
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000,
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
};

app.get(`/PDF`, async (req, res) => {
  const myPath = path.join(__dirname, "./PDF");
  createInvoice(invoice, myPath + `/test.pdf`);
  await sendEmail("mustapha2525.ahmed@gmail.com", "<p>first pdf</p>", [
    {
      filename: "test.pdf",
      path: myPath + `/test.pdf`,
      contentType:'application/pdf'
    },
  ]);
  res.end();
});

RunDB();

const port = process.env.PORT || 50000;
app.listen(port, () => console.log(`listening on port ${port}!`));
