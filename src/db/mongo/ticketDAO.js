import ticketModel from "./models/ticket.model.js";

export default class ticketDAO {
  async create(data) {
    return await ticketModel.create(data);
  }
}
