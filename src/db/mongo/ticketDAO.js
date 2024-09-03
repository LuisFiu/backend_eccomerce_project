import ticketModel from "./models/ticket.model.js";

export default class ticketDAO {
  async create(data) {
    try {
      return await ticketModel.create(data);
    } catch (error) {
      return null;
    }
  }
}
