import { makeid } from "../../utils.js";
import ticketModel from "./models/ticket.model.js";
import userModel from "./models/user.model.js";

export default class ticketDAO {
  async create(amount, purchaser) {
    const foundPurchaser = await userModel.findOne({ email: purchaser });

    if (!foundPurchaser) {
      return { status: "error", message: "Invalid Values" };
    }

    const purchase_datetime = new Date().toISOString();

    const purchaseInfo = {
      code: makeid(25),
      purchase_datetime,
      amount,
      purchaser,
    };

    const ticket = await ticketModel.create(purchaseInfo);

    return ticket;
  }
}
